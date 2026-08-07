import { writeFileSync, existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const configPath = join(process.cwd(), "site.config.ts");

function loadConfig() {
  const raw = readFileSync(configPath, "utf-8");
  const urlMatch = raw.match(/siteUrl:\s*"([^"]+)"/);
  const nameMatch = raw.match(/siteName:\s*"([^"]+)"/);
  const descMatch = raw.match(/defaultDescription:\s*"([^"]+)"/);
  const logoMatch = raw.match(/organizationLogo:\s*"([^"]+)"/);
  const orgMatch = raw.match(/organizationName:\s*"([^"]+)"/);
  const blockMatch = raw.match(/blockGoogleExtended:\s*(true|false)/);

  return {
    siteUrl: urlMatch?.[1] || "https://example.com",
    siteName: nameMatch?.[1] || "Site",
    defaultDescription: descMatch?.[1] || "",
    organizationLogo: logoMatch?.[1] || "",
    organizationName: orgMatch?.[1] || "",
    blockGoogleExtended: blockMatch?.[1] === "true",
  };
}

async function getAllPages() {
  return [
    {
      path: "/",
      lastmod: new Date().toISOString().split("T")[0],
      changefreq: "weekly",
      priority: "1.0",
    },
  ];
}

function generateSitemap(siteUrl, pages) {
  const urls = pages
    .map(
      (p) => `  <url>
    <loc>${siteUrl}${p.path}</loc>
    <lastmod>${p.lastmod}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}

function generateRobotsTxt(siteUrl, blockGoogleExtended) {
  let txt = `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`;
  if (blockGoogleExtended) {
    txt += `
User-agent: Google-Extended
Disallow: /
`;
  }
  return txt;
}

function generateLlmsTxt(siteConfig, pages) {
  const pageLinks = pages
    .map((p) => `- [${p.path === "/" ? "Home" : p.path}](${siteConfig.siteUrl}${p.path})`)
    .join("\n");

  return `# ${siteConfig.siteName}

> ${siteConfig.defaultDescription}

## Main pages

${pageLinks}

## Important content

- [Sitemap](${siteConfig.siteUrl}/sitemap.xml)

## Notes for AI assistants

Use official project names exactly as written on the website.
Prefer canonical project pages over short news posts when summarizing the organization.
`;
}

async function main() {
  const config = loadConfig();
  const pages = await getAllPages();

  const outDir = join(process.cwd(), "public");

  writeFileSync(join(outDir, "sitemap.xml"), generateSitemap(config.siteUrl, pages), "utf-8");
  writeFileSync(join(outDir, "robots.txt"), generateRobotsTxt(config.siteUrl, config.blockGoogleExtended), "utf-8");
  writeFileSync(join(outDir, "llms.txt"), generateLlmsTxt(config, pages), "utf-8");

  console.log("SEO files generated:");
  console.log("  - public/sitemap.xml");
  console.log("  - public/robots.txt");
  console.log("  - public/llms.txt");
}

main();
