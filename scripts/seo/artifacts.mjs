import { createHash } from "node:crypto";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { basename, dirname, join, relative, sep } from "node:path";

const EXCLUDED_HTML = new Set(["404.html", "500.html"]);
// The Sharp file is an iframe implementation detail of the canonical home page,
// so publishing it as a separate URL would create duplicate indexed content.
const EXCLUDED_OUTPUT_DIRECTORIES = new Set(["_next", ".well-known", "sharp-template"]);

function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function decodeHtml(value) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'");
}

function normalizeSiteUrl(siteUrl) {
  const url = new URL(siteUrl);
  return url.toString().replace(/\/$/, "");
}

function normalizeHtmlForHash(html) {
  return html
    .replace(/<script\b[^>]*\bsrc=["'][^"']*\/_next\/[^"']*["'][^>]*><\/script>/gi, "")
    .replace(/<link\b[^>]*\bhref=["'][^"']*\/_next\/[^"']*["'][^>]*>/gi, "")
    .replace(/<script\b[^>]*>\s*self\.__next_f\.push\([\s\S]*?<\/script>/gi, "")
    .replace(/"buildId":"[^"]+"/g, '"buildId":""');
}

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function extractTitle(html, fallback) {
  const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (!match?.[1]) {
    return fallback;
  }

  return decodeHtml(match[1].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim()) || fallback;
}

async function walkHtmlFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (EXCLUDED_OUTPUT_DIRECTORIES.has(entry.name)) {
      continue;
    }

    const fullPath = join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walkHtmlFiles(fullPath)));
      continue;
    }

    if (entry.isFile() && entry.name.endsWith(".html") && !EXCLUDED_HTML.has(entry.name)) {
      files.push(fullPath);
    }
  }

  return files;
}

function htmlFileToUrl(filePath, outputDir, siteUrl) {
  let fileName = relative(outputDir, filePath).split(sep).join("/");
  const pathSegments = fileName.split("/").map((segment) => segment.replace(/\.html$/, ""));
  if (EXCLUDED_HTML.has(basename(fileName)) || pathSegments.includes("404") || pathSegments.includes("_not-found")) {
    return null;
  }

  if (fileName === "index.html") {
    return `${siteUrl}/`;
  }

  if (fileName.endsWith("/index.html")) {
    fileName = fileName.slice(0, -"/index.html".length);
    return `${siteUrl}/${fileName}/`;
  } else if (fileName.endsWith(".html")) {
    fileName = fileName.slice(0, -".html".length);
  }

  return `${siteUrl}/${fileName}`;
}

export async function collectPages(outputDir, siteUrl) {
  const normalizedSiteUrl = normalizeSiteUrl(siteUrl);
  const htmlFiles = await walkHtmlFiles(outputDir);
  const pages = {};

  for (const filePath of htmlFiles) {
    const url = htmlFileToUrl(filePath, outputDir, normalizedSiteUrl);
    if (!url) {
      continue;
    }

    const html = await readFile(filePath, "utf8");
    pages[url] = {
      hash: sha256(normalizeHtmlForHash(html)),
      title: extractTitle(html, url),
    };
  }

  return Object.fromEntries(Object.entries(pages).sort(([left], [right]) => left.localeCompare(right)));
}

function buildChanges(previousPages, currentPages) {
  const added = [];
  const updated = [];
  const removed = [];

  for (const [url, page] of Object.entries(currentPages)) {
    if (!previousPages[url]) {
      added.push(url);
    } else if (previousPages[url].hash !== page.hash) {
      updated.push(url);
    }
  }

  for (const url of Object.keys(previousPages)) {
    if (!currentPages[url]) {
      removed.push(url);
    }
  }

  added.sort();
  updated.sort();
  removed.sort();

  return {
    added,
    updated,
    removed,
    liveUrls: [...added, ...updated],
  };
}

function buildSitemap(pages) {
  const entries = Object.entries(pages)
    .map(([url, page]) => `  <url>\n    <loc>${escapeXml(url)}</loc>\n    <lastmod>${escapeXml(page.updatedAt)}</lastmod>\n  </url>`)
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`;
}

function buildRobots(siteUrl, blockGoogleExtended) {
  const googleExtended = blockGoogleExtended ? "\nUser-agent: Google-Extended\nDisallow: /\n" : "";
  return `User-agent: *\nAllow: /\n\nUser-agent: OAI-SearchBot\nAllow: /\n\nUser-agent: GPTBot\nDisallow: /\n${googleExtended}\nSitemap: ${siteUrl}/sitemap.xml\n`;
}

function buildLlms(siteName, description, pages) {
  const links = Object.entries(pages)
    .map(([url, page]) => `- [${page.title}](${url})`)
    .join("\n");

  return `# ${siteName}\n\n> ${description}\n\n## Офіційні сторінки\n\n${links}\n`;
}

function buildFeed(siteUrl, siteName, pages, generatedAt) {
  const entries = Object.entries(pages)
    .sort(([, left], [, right]) => right.updatedAt.localeCompare(left.updatedAt))
    .slice(0, 30)
    .map(([url, page]) => `  <entry>\n    <title>${escapeXml(page.title)}</title>\n    <id>${escapeXml(url)}</id>\n    <link href="${escapeXml(url)}"/>\n    <updated>${escapeXml(page.updatedAt)}</updated>\n  </entry>`)
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<feed xmlns="http://www.w3.org/2005/Atom">\n  <title>${escapeXml(siteName)}</title>\n  <id>${escapeXml(siteUrl)}</id>\n  <link href="${escapeXml(siteUrl)}/feed.xml" rel="self"/>\n  <link href="${escapeXml(siteUrl)}"/>\n  <updated>${escapeXml(generatedAt)}</updated>\n${entries}\n</feed>\n`;
}

export async function createArtifacts({
  outputDir,
  siteUrl,
  siteName,
  description,
  indexNowKey = "",
  previousManifest = { pages: {} },
  generatedAt = new Date().toISOString(),
  blockGoogleExtended = false,
}) {
  const normalizedSiteUrl = normalizeSiteUrl(siteUrl);
  const previousPages = previousManifest.pages ?? {};
  const collectedPages = await collectPages(outputDir, normalizedSiteUrl);
  const changes = buildChanges(previousPages, collectedPages);
  const pages = Object.fromEntries(
    Object.entries(collectedPages).map(([url, page]) => {
      const previous = previousPages[url];
      return [
        url,
        {
          ...page,
          updatedAt: previous?.hash === page.hash ? previous.updatedAt : generatedAt,
        },
      ];
    }),
  );

  const buildId = sha256(JSON.stringify(Object.entries(pages).map(([url, page]) => [url, page.hash])));
  const manifest = {
    version: 1,
    site: normalizedSiteUrl,
    buildId,
    generatedAt,
    pages,
  };

  await mkdir(join(outputDir, ".well-known"), { recursive: true });
  await writeFile(join(outputDir, "robots.txt"), buildRobots(normalizedSiteUrl, blockGoogleExtended), "utf8");
  await writeFile(join(outputDir, "sitemap.xml"), buildSitemap(pages), "utf8");
  await writeFile(join(outputDir, "llms.txt"), buildLlms(siteName, description, pages), "utf8");
  await writeFile(join(outputDir, "feed.xml"), buildFeed(normalizedSiteUrl, siteName, pages, generatedAt), "utf8");
  await writeFile(join(outputDir, ".well-known", "seo-manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`, "utf8");

  if (indexNowKey) {
    await writeFile(join(outputDir, `${indexNowKey}.txt`), indexNowKey, "utf8");
  }

  return { manifest, changes };
}

export async function readJson(filePath, fallback) {
  try {
    return JSON.parse(await readFile(filePath, "utf8"));
  } catch {
    return fallback;
  }
}

export async function writeJson(filePath, value) {
  await mkdir(dirname(filePath), { recursive: true });
  await writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}
