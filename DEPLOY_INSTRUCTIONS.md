# BodyRes — production deploy runbook

Current production architecture is **STATIC EXPORT → Hostinger static hosting**. This file is a short operational runbook; architecture authority is `docs/architecture-decisions.md`, and build/runtime quirks live in `docs/build-rules.md`.

## Production contract

- Production output: `out/`.
- Public production does not require a persistent Node.js server.
- Do not introduce SSR/API/server-only Next.js features without a separate approved architecture decision.
- Canonical production upload path is `scripts/deploy-static-ftp.py` using protected Hostinger configuration/secrets.
- GitHub Pages is not the canonical production target.

## Before deploy

A production deployment requires explicit authorization for the current change.

Run the current project gates:

```bash
npm ci
npm run test:seo
npm run build:static
npm run ci
```

Then inspect the resulting diff/output and only after green gates run:

```bash
python scripts/deploy-static-ftp.py --notify
```

`--notify` must wait for the production manifest/build ID before external index notifications. A successful file upload is not enough to call the release complete; verify the live production surface afterwards.

## Secrets

- Local Hostinger config/secrets: gitignored `.env.hostinger.local`.
- CI deploy credentials: GitHub Actions secrets.
- `.env.hostinger.example` contains only non-secret field names/examples.
- Never copy real credentials into Git, docs, issue trackers, chat or logs.

## GitHub Actions

- `.github/workflows/preview.yml` owns static-export/E2E CI for pushes/PRs.
- `.github/workflows/static-production.yml` is the Hostinger production workflow and must remain explicitly controlled; do not create or enable a new automatic production trigger without owner approval.
- Any legacy GitHub Pages/example-domain workflow is not a production source of truth.

## NAS preview

`http://nlmhelp.keenetic.link:18084/` is the documented NAS/container preview when that runtime is available. Preview and production are separate deployment surfaces: updating one does not prove the other is current.

For router/NAS/Vaultwarden/provider access details, read `AGENT_START_HERE.md` and verify current tool/runtime state before acting.
