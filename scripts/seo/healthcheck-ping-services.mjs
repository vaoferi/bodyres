import { loadConfig } from "./config.mjs";
import { healthCheckXmlRpcService } from "./xmlrpc.mjs";

async function main() {
  const config = await loadConfig();
  const results = [];

  for (const service of config.legacyPingServices) {
    try {
      const result = await healthCheckXmlRpcService({ endpoint: service.url });
      results.push({ service: service.name, status: "success", httpStatus: result.status });
    } catch (error) {
      results.push({ service: service.name, status: "failed", error: error instanceof Error ? error.message : String(error) });
    }
  }

  console.log(JSON.stringify(results, null, 2));
  if (results.some((result) => result.status === "failed")) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
