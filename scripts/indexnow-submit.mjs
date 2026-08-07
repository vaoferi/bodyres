import { readFileSync } from "node:fs";
import { join } from "node:path";

function loadSiteUrl() {
  const configPath = join(process.cwd(), "site.config.ts");
  const raw = readFileSync(configPath, "utf-8");
  const match = raw.match(/siteUrl:\s*"([^"]+)"/);
  return match?.[1] || "https://example.com";
}

function extractHost(siteUrl: string) {
  return new URL(siteUrl).hostname;
}

async function submitToIndexNow(host: string, key: string, urlList: string[]) {
  const payload = {
    host,
    key,
    keyLocation: `https://${host}/${key}.txt`,
    urlList,
  };

  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(payload),
  });

  if (res.status === 200 || res.status === 202) {
    console.log(`IndexNow: submitted ${urlList.length} URL(s) — HTTP ${res.status}`);
  } else {
    const text = await res.text();
    console.error(`IndexNow error: HTTP ${res.status} — ${text}`);
    process.exit(1);
  }
}

async function main() {
  const key = process.env.INDEXNOW_KEY;
  if (!key) {
    console.error("Error: INDEXNOW_KEY env variable is not set.");
    console.error("Generate a key and add it to GitHub Secrets.");
    process.exit(1);
  }

  const siteUrl = loadSiteUrl();
  const host = extractHost(siteUrl);
  const urls = process.argv.slice(2);

  if (urls.length === 0) {
    console.error("Usage: node scripts/indexnow-submit.mjs <url1> <url2> ...");
    process.exit(1);
  }

  await submitToIndexNow(host, key, urls);
}

main();
