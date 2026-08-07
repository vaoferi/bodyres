import { mkdir } from "node:fs/promises";

import { readJson, writeJson } from "./artifacts.mjs";
import { loadConfig } from "./config.mjs";
import {
  failedResult,
  notifyWebSub,
  submitGoogleSitemap,
  submitIndexNow,
  verifyLiveUrl,
} from "./notifier.mjs";
import { pingXmlRpcService } from "./xmlrpc.mjs";

async function runSafely(service, action) {
  try {
    return await action();
  } catch (error) {
    return failedResult(service, error);
  }
}

async function sendTelegram(report, config) {
  if (!config.telegram.token || !config.telegram.chatId) {
    return { service: "Telegram", status: "skipped", reason: "Telegram credentials are missing" };
  }

  const failures = report.results.filter((result) => result.status === "failed").length;
  const text = [
    "Body Restore — SEO update",
    `Змінені URL: ${report.liveUrls.length}`,
    `Помилки: ${failures}`,
    ...report.results.map((result) => `${result.status === "success" ? "✅" : result.status === "skipped" ? "⏭" : "❌"} ${result.service}: ${result.status}`),
  ].join("\n");

  const response = await fetch(`https://api.telegram.org/bot${config.telegram.token}/sendMessage`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ chat_id: config.telegram.chatId, text, disable_web_page_preview: true }),
    signal: AbortSignal.timeout(15_000),
  });
  if (!response.ok) {
    throw new Error(`Telegram HTTP ${response.status}`);
  }
  return { service: "Telegram", status: "success" };
}

async function main() {
  const config = await loadConfig();
  const changes = await readJson(config.changedUrlsPath, { liveUrls: [], added: [], updated: [], removed: [] });
  const liveUrls = [...new Set(changes.liveUrls ?? [...(changes.added ?? []), ...(changes.updated ?? [])])];
  const results = [];

  for (const url of liveUrls) {
    results.push(await runSafely(`Verify ${url}`, () => verifyLiveUrl({ url, siteUrl: config.siteUrl })));
  }

  const verificationFailed = results.some((result) => result.status === "failed");
  if (!verificationFailed && liveUrls.length) {
    results.push(await runSafely("IndexNow", () => submitIndexNow({ siteUrl: config.siteUrl, key: config.indexNow.key, urls: liveUrls })));
    results.push(await runSafely("Google Search Console", () => submitGoogleSitemap({ google: config.google, sitemapUrl: config.sitemapUrl })));

    for (const service of config.pingServices.filter((item) => item.enabled)) {
      results.push(await runSafely(service.name, async () => {
        await pingXmlRpcService({ endpoint: service.url, siteName: config.siteName, siteUrl: config.siteUrl, feedUrl: config.feedUrl });
        return { service: service.name, status: "success" };
      }));
    }

    results.push(await runSafely("WebSub", () => notifyWebSub({ ...config.webSub, feedUrl: config.feedUrl })));
  } else if (!liveUrls.length) {
    results.push({ service: "Notifications", status: "skipped", reason: "No changed live URLs" });
  }

  const report = {
    generatedAt: new Date().toISOString(),
    buildId: changes.buildId ?? "",
    liveUrls,
    changes: {
      added: changes.added ?? [],
      updated: changes.updated ?? [],
      removed: changes.removed ?? [],
    },
    results,
  };

  const telegramResult = await runSafely("Telegram", () => sendTelegram(report, config));
  report.results.push(telegramResult);
  await mkdir(config.stateDir, { recursive: true });
  await writeJson(config.reportPath, report);
  console.log(JSON.stringify(report, null, 2));

  const criticalFailure = verificationFailed || results.some((result) =>
    result.status === "failed" && ["IndexNow", "Google Search Console"].includes(result.service),
  );
  if (criticalFailure) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
