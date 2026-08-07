import { access, mkdir } from "node:fs/promises";
import { resolve } from "node:path";

import { createArtifacts, readJson, writeJson } from "./artifacts.mjs";
import { loadConfig } from "./config.mjs";

async function main() {
  const config = await loadConfig();
  const outputDir = resolve(config.outputDir);
  try {
    await access(outputDir);
  } catch {
    throw new Error(`Static output directory does not exist: ${outputDir}`);
  }

  const previousManifest = await readJson(config.previousManifestPath, { pages: {} });
  const result = await createArtifacts({
    outputDir,
    siteUrl: config.siteUrl,
    siteName: config.siteName,
    description: config.description,
    indexNowKey: config.indexNow.key,
    previousManifest,
    blockGoogleExtended: config.blockGoogleExtended,
  });

  await mkdir(config.stateDir, { recursive: true });
  await writeJson(config.changedUrlsPath, {
    generatedAt: result.manifest.generatedAt,
    buildId: result.manifest.buildId,
    ...result.changes,
  });

  console.log(JSON.stringify({
    buildId: result.manifest.buildId,
    pages: Object.keys(result.manifest.pages).length,
    added: result.changes.added.length,
    updated: result.changes.updated.length,
    removed: result.changes.removed.length,
  }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
