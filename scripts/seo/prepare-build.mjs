import { loadConfig } from "./config.mjs";
import { preparePreviousManifest } from "./previous-manifest.mjs";

async function main() {
  const config = await loadConfig();
  const result = await preparePreviousManifest(config);

  if (result.source === "production") {
    console.log(`Previous production manifest loaded: ${result.pages} page(s)`);
  } else {
    console.warn(`Previous production manifest unavailable (${result.reason}); using ${result.source} state.`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
