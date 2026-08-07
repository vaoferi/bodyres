import { randomBytes } from "node:crypto";
import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

async function exists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function loadEnvironmentFile(filePath) {
  if (!(await exists(filePath))) {
    return {};
  }

  const values = {};
  for (const rawLine of (await readFile(filePath, "utf8")).split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#") || !line.includes("=")) {
      continue;
    }
    const [key, ...rest] = line.split("=");
    values[key.trim()] = rest.join("=").trim().replace(/^['"]|['"]$/g, "");
  }
  return values;
}

export async function ensureIndexNowKey({ stateDir = ".seo", configuredKey = "" } = {}) {
  if (configuredKey) {
    return configuredKey;
  }

  const keyPath = join(stateDir, "indexnow-key.txt");
  if (await exists(keyPath)) {
    return (await readFile(keyPath, "utf8")).trim();
  }

  const key = randomBytes(24).toString("hex");
  await mkdir(stateDir, { recursive: true });
  await writeFile(keyPath, key, "utf8");
  return key;
}

export async function loadConfig() {
  const localValues = await loadEnvironmentFile(process.env.SEO_ENV_FILE ?? ".env.hostinger.local");
  const value = (name, fallback = "") => process.env[name]?.trim() || localValues[name]?.trim() || fallback;
  const siteUrl = value("SITE_URL", "https://body-re.store").replace(/\/$/, "");
  const stateDir = value("SEO_STATE_DIR", ".seo");
  const indexNowKey = await ensureIndexNowKey({ stateDir, configuredKey: value("INDEXNOW_KEY") });

  return {
    siteUrl,
    siteName: value("SITE_NAME", "Body Restore"),
    description: value("SITE_DESCRIPTION", "Body Restore — професійний масаж в Одесі."),
    outputDir: value("OUTPUT_DIR", "out"),
    stateDir,
    previousManifestPath: value("PREVIOUS_MANIFEST_PATH", join(stateDir, "previous-manifest.json")),
    changedUrlsPath: value("CHANGED_URLS_PATH", join(stateDir, "changed-urls.json")),
    reportPath: value("NOTIFICATION_REPORT_PATH", join(stateDir, "notification-report.json")),
    sitemapUrl: `${siteUrl}/sitemap.xml`,
    feedUrl: `${siteUrl}/feed.xml`,
    indexNow: { key: indexNowKey },
    google: {
      siteUrl: value("GOOGLE_SEARCH_CONSOLE_SITE_URL", ""),
      credentialsJson: value("GOOGLE_SERVICE_ACCOUNT_JSON", ""),
    },
    telegram: {
      token: value("TELEGRAM_BOT_TOKEN", ""),
      chatId: value("TELEGRAM_CHAT_ID", ""),
    },
    webSub: {
      enabled: value("WEBSUB_ENABLED", "false") === "true",
      hubUrl: value("WEBSUB_HUB_URL", "https://pubsubhubbub.appspot.com/"),
    },
    blockGoogleExtended: value("BLOCK_GOOGLE_EXTENDED", "false") === "true",
    pingServices: [
      { name: "Ping-O-Matic", url: "http://rpc.pingomatic.com/", enabled: value("PING_SERVICES_ENABLED", "true") === "true" },
      { name: "Twingly", url: "http://rpc.twingly.com/", enabled: value("PING_SERVICES_ENABLED", "true") === "true" },
    ],
    legacyPingServices: [
      { name: "blo.gs", url: "http://ping.blo.gs/" },
      { name: "With2", url: "http://blog.with2.net/ping.php" },
      { name: "Blogdigger", url: "http://www.blogdigger.com/RPC2" },
      { name: "Blogshares", url: "http://www.blogshares.com/rpc.php" },
      { name: "Blogsnow", url: "http://www.blogsnow.com/ping" },
      { name: "Blogstreet", url: "http://www.blogstreet.com/xrbin/xmlrpc.cgi" },
      { name: "Bulkfeeds", url: "http://bulkfeeds.net/rpc" },
      { name: "Weblogalot RPC", url: "http://ping.weblogalot.com/rpc.php" },
      { name: "FeedSubmitter", url: "http://www.feedsubmitter.com" },
      { name: "Pingerati", url: "http://www.pingerati.net" },
      { name: "Bloggerei", url: "http://rpc.bloggerei.de/ping/" },
      { name: "Bloggers.jp", url: "http://ping.bloggers.jp/rpc" },
    ],
  };
}
