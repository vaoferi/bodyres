from __future__ import annotations

import argparse
import ftplib
import json
import os
import posixpath
import subprocess
import time
import urllib.error
import urllib.request
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
ENV_FILE = ROOT / ".env.hostinger.local"
LOCAL_OUT = ROOT / "out"
LOCAL_MANIFEST = LOCAL_OUT / ".well-known" / "seo-manifest.json"
MEDIA_SUFFIXES = {".gif", ".ico", ".jpg", ".jpeg", ".mp4", ".png", ".svg", ".webp"}


def load_env(path: Path) -> dict[str, str]:
    values: dict[str, str] = {}
    if not path.exists():
        return values

    for raw_line in path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        values[key.strip()] = value.strip().strip('"').strip("'")
    return values


def required(values: dict[str, str], key: str) -> str:
    value = os.environ.get(key) or values.get(key)
    if not value:
        raise RuntimeError(f"Missing {key} in {ENV_FILE.name} or environment")
    return value


def ensure_remote_dir(ftp: ftplib.FTP, path: str) -> None:
    current = ftp.pwd()
    try:
        for part in [segment for segment in path.replace("\\", "/").split("/") if segment]:
            try:
                ftp.cwd(part)
            except ftplib.error_perm:
                ftp.mkd(part)
                ftp.cwd(part)
    finally:
        ftp.cwd(current)


def connect_ftp(host: str, port: int, user: str, password: str, remote_dir: str) -> ftplib.FTP:
    ftp = ftplib.FTP()
    ftp.connect(host=host, port=port, timeout=45)
    ftp.login(user=user, passwd=password)
    ftp.cwd(remote_dir)
    return ftp


def close_ftp(ftp: ftplib.FTP | None) -> None:
    if ftp is None:
        return
    try:
        ftp.quit()
    except (AttributeError, OSError, EOFError, ftplib.Error, TimeoutError):
        ftp.close()


def delete_hostinger_temp_file(ftp: ftplib.FTP, remote_dir: str, filename: str) -> None:
    for temp_name in (f".in.{filename}", f".in.{filename}."):
        temp_path = posixpath.join(remote_dir, temp_name) if remote_dir else temp_name
        try:
            ftp.delete(temp_path)
        except ftplib.Error:
            pass


def remote_size(ftp: ftplib.FTP, relative: str) -> int | None:
    try:
        return ftp.size(relative)
    except ftplib.Error:
        return None


def upload_tree(
    ftp: ftplib.FTP,
    local_root: Path,
    dry_run: bool,
    *,
    reconnect,
    retries: int,
    skip_same_size_media: bool,
) -> tuple[int, int, ftplib.FTP]:
    file_count = 0
    byte_count = 0

    for local_path in sorted(local_root.rglob("*")):
        if local_path.is_dir():
            continue

        relative = local_path.relative_to(local_root).as_posix()
        remote_dir = str(Path(relative).parent).replace("\\", "/")
        if remote_dir == ".":
            remote_dir = ""

        if remote_dir:
            ensure_remote_dir(ftp, remote_dir)

        file_count += 1
        byte_count += local_path.stat().st_size

        if dry_run:
            continue

        if skip_same_size_media and local_path.suffix.lower() in MEDIA_SUFFIXES:
            existing_size = remote_size(ftp, relative)
            if existing_size == local_path.stat().st_size:
                continue

        for attempt in range(1, retries + 1):
            try:
                if remote_dir:
                    ensure_remote_dir(ftp, remote_dir)
                with local_path.open("rb") as file_handle:
                    ftp.storbinary(f"STOR {relative}", file_handle)
                break
            except (OSError, EOFError, ftplib.Error, TimeoutError) as exc:
                if attempt >= retries:
                    raise
                if isinstance(exc, ftplib.error_perm) and "Temporary hidden file" in str(exc):
                    delete_hostinger_temp_file(ftp, remote_dir, local_path.name)
                close_ftp(ftp)
                ftp = reconnect()

    return file_count, byte_count, ftp


def load_local_manifest() -> dict[str, str]:
    if not LOCAL_MANIFEST.exists():
        raise RuntimeError("Missing out/.well-known/seo-manifest.json. Run npm run build:static first.")
    return json.loads(LOCAL_MANIFEST.read_text(encoding="utf-8"))


def wait_for_live_manifest(site_url: str, build_id: str, timeout_seconds: int) -> None:
    deadline = time.monotonic() + timeout_seconds
    manifest_url = f"{site_url.rstrip('/')}/.well-known/seo-manifest.json"
    last_error = "no response"

    while time.monotonic() < deadline:
        try:
            request = urllib.request.Request(
                f"{manifest_url}?build={build_id}",
                headers={"User-Agent": "BodyRestore-SEO-Deploy/1.0", "Cache-Control": "no-cache"},
            )
            with urllib.request.urlopen(request, timeout=20) as response:
                payload = json.loads(response.read().decode("utf-8"))
            if payload.get("buildId") == build_id:
                return
            last_error = f"received different buildId: {payload.get('buildId', 'missing')}"
        except (OSError, ValueError, urllib.error.HTTPError, urllib.error.URLError) as error:
            last_error = str(error)
        time.sleep(5)

    raise RuntimeError(f"Production manifest did not match deployed build after {timeout_seconds}s: {last_error}")


def notify_services(env: dict[str, str]) -> None:
    node = env.get("NODE_EXECUTABLE", "node")
    result = subprocess.run(
        [node, "scripts/seo/notify-services.mjs"],
        cwd=ROOT,
        env={**os.environ, **env},
        check=False,
    )
    if result.returncode != 0:
        raise RuntimeError(f"SEO notification failed with exit code {result.returncode}")


def main() -> int:
    parser = argparse.ArgumentParser(description="Deploy BodyRes static export to Hostinger FTP.")
    parser.add_argument("--dry-run", action="store_true", help="Connect and count files without uploading.")
    parser.add_argument("--retries", type=int, default=3, help="FTP upload attempts per file.")
    parser.add_argument(
        "--force-media",
        action="store_true",
        help="Upload media files even when an equal-sized remote file already exists.",
    )
    parser.add_argument(
        "--notify",
        action="store_true",
        help="Verify the deployed manifest and notify indexing services after upload.",
    )
    parser.add_argument(
        "--notify-timeout",
        type=int,
        default=180,
        help="Seconds to wait for the deployed SEO manifest before notifying services.",
    )
    args = parser.parse_args()

    if not LOCAL_OUT.exists():
        raise RuntimeError("Missing out/ directory. Run npm run build:static first.")
    env = load_env(ENV_FILE)
    host = required(env, "HOSTINGER_FTP_HOST").replace("ftp://", "").replace("ftps://", "")
    port = int(required(env, "HOSTINGER_FTP_PORT"))
    user = required(env, "HOSTINGER_FTP_USER")
    password = required(env, "HOSTINGER_FTP_PASSWORD")
    remote_dir = required(env, "HOSTINGER_FTP_REMOTE_DIR")

    def reconnect() -> ftplib.FTP:
        return connect_ftp(host, port, user, password, remote_dir)

    ftp = reconnect()

    try:
        files, bytes_total, ftp = upload_tree(
            ftp,
            LOCAL_OUT,
            args.dry_run,
            reconnect=reconnect,
            retries=args.retries,
            skip_same_size_media=not args.force_media,
        )
    finally:
        close_ftp(ftp)

    mode = "dry-run" if args.dry_run else "uploaded"
    print(f"FTP {mode}: {files} files, {bytes_total} bytes, remote={remote_dir}")

    if args.notify and not args.dry_run:
        manifest = load_local_manifest()
        site_url = os.environ.get("SITE_URL") or env.get("SITE_URL") or "https://body-re.store"
        build_id = manifest.get("buildId")
        if not build_id:
            raise RuntimeError("Local SEO manifest has no buildId")
        wait_for_live_manifest(site_url, build_id, args.notify_timeout)
        notify_services(env)

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
