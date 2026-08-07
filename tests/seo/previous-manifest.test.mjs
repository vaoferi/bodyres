import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

import { preparePreviousManifest } from "../../scripts/seo/previous-manifest.mjs";

test("resets stale local state when production has no SEO manifest yet", async (t) => {
  const stateDir = await mkdtemp(join(tmpdir(), "bodyres-seo-state-"));
  t.after(() => rm(stateDir, { recursive: true, force: true }));

  const previousManifestPath = join(stateDir, "previous-manifest.json");
  await writeFile(
    previousManifestPath,
    JSON.stringify({
      version: 1,
      site: "https://body-re.store",
      pages: {
        "https://body-re.store/": { hash: "stale", updatedAt: "2026-07-01T00:00:00.000Z" },
      },
    }),
    "utf8",
  );

  const result = await preparePreviousManifest({
    siteUrl: "https://body-re.store",
    previousManifestPath,
    fetchImpl: async () => new Response("Not found", { status: 404 }),
  });

  assert.deepEqual(result, { source: "empty", reason: "HTTP 404" });
  assert.deepEqual(JSON.parse(await readFile(previousManifestPath, "utf8")).pages, {});
});
