import { readJson, writeJson } from "./artifacts.mjs";

function emptyManifest(siteUrl) {
  return { version: 1, site: siteUrl, pages: {} };
}

export async function preparePreviousManifest({ siteUrl, previousManifestPath, fetchImpl = fetch }) {
  const manifestUrl = `${siteUrl}/.well-known/seo-manifest.json?state=${Date.now()}`;

  try {
    const response = await fetchImpl(manifestUrl, {
      headers: { "user-agent": "BodyRestore-SEO-Build/1.0", "cache-control": "no-cache" },
      signal: AbortSignal.timeout(15_000),
    });

    if (response.status === 404) {
      // A confirmed missing manifest means this is the first tracked release;
      // retaining stale local state would suppress its IndexNow notification.
      await writeJson(previousManifestPath, emptyManifest(siteUrl));
      return { source: "empty", reason: "HTTP 404" };
    }

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const manifest = await response.json();
    if (!manifest?.pages || manifest.site !== siteUrl) {
      throw new Error("manifest is not valid for this site");
    }

    await writeJson(previousManifestPath, manifest);
    return { source: "production", pages: Object.keys(manifest.pages).length };
  } catch (error) {
    const existing = await readJson(previousManifestPath, null);
    if (existing?.pages) {
      return { source: "local", reason: error.message };
    }

    await writeJson(previousManifestPath, emptyManifest(siteUrl));
    return { source: "empty", reason: error.message };
  }
}
