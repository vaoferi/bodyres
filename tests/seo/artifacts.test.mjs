import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

import { createArtifacts } from "../../scripts/seo/artifacts.mjs";

const hash = (value) => createHash("sha256").update(value).digest("hex");

test("keeps lastModified for unchanged pages and records added, updated, and removed URLs", async (t) => {
  const outputDir = await mkdtemp(join(tmpdir(), "bodyres-seo-"));
  t.after(() => rm(outputDir, { recursive: true, force: true }));

  const home = "<html><head><title>Body Restore</title></head><body>Home</body></html>";
  const about = "<html><head><title>Про нас</title></head><body>Updated</body></html>";
  await writeFile(join(outputDir, "index.html"), home, "utf8");
  await writeFile(join(outputDir, "about.html"), about, "utf8");
  await writeFile(join(outputDir, "_not-found.html"), "<html><title>404</title></html>", "utf8");
  await mkdir(join(outputDir, "404"));
  await writeFile(join(outputDir, "404", "index.html"), "<html><title>404</title></html>", "utf8");
  await writeFile(join(outputDir, "404.html"), "<html>Not found</html>", "utf8");
  await mkdir(join(outputDir, "sharp-template", "Sharp"), { recursive: true });
  await writeFile(
    join(outputDir, "sharp-template", "Sharp", "index.html"),
    "<html><head><title>Iframe template</title></head><body>Internal template</body></html>",
    "utf8",
  );

  const unchangedAt = "2026-07-01T10:00:00.000Z";
  const previousManifest = {
    version: 1,
    generatedAt: "2026-07-01T10:00:00.000Z",
    pages: {
      "https://body-re.store/": { hash: hash(home), title: "Body Restore", updatedAt: unchangedAt },
      "https://body-re.store/about": { hash: hash("old"), title: "Про нас", updatedAt: unchangedAt },
      "https://body-re.store/removed": { hash: hash("removed"), title: "Removed", updatedAt: unchangedAt },
    },
  };

  const result = await createArtifacts({
    outputDir,
    siteUrl: "https://body-re.store",
    siteName: "Body Restore",
    description: "Масажний кабінет в Одесі",
    indexNowKey: "test-indexnow-key",
    previousManifest,
    generatedAt: "2026-07-15T12:00:00.000Z",
  });

  assert.deepEqual(result.changes.added, []);
  assert.deepEqual(result.changes.updated, ["https://body-re.store/about"]);
  assert.deepEqual(result.changes.removed, ["https://body-re.store/removed"]);
  assert.deepEqual(result.changes.liveUrls, ["https://body-re.store/about"]);
  assert.equal(result.manifest.pages["https://body-re.store/"].updatedAt, unchangedAt);
  assert.equal(result.manifest.pages["https://body-re.store/about"].updatedAt, "2026-07-15T12:00:00.000Z");
  assert.equal(result.manifest.pages["https://body-re.store/_not-found"], undefined);
  assert.equal(result.manifest.pages["https://body-re.store/404"], undefined);
  assert.equal(result.manifest.pages["https://body-re.store/sharp-template/Sharp"], undefined);

  assert.match(await readFile(join(outputDir, "robots.txt"), "utf8"), /Sitemap: https:\/\/body-re\.store\/sitemap\.xml/);
  assert.match(await readFile(join(outputDir, "sitemap.xml"), "utf8"), /https:\/\/body-re\.store\/about/);
  assert.doesNotMatch(await readFile(join(outputDir, "sitemap.xml"), "utf8"), /sharp-template/);
  assert.match(await readFile(join(outputDir, "llms.txt"), "utf8"), /\[Про нас\]\(https:\/\/body-re\.store\/about\)/);
  assert.doesNotMatch(await readFile(join(outputDir, "llms.txt"), "utf8"), /sharp-template/);
  assert.match(await readFile(join(outputDir, "feed.xml"), "utf8"), /<title>Про нас<\/title>/);
  assert.doesNotMatch(await readFile(join(outputDir, "feed.xml"), "utf8"), /sharp-template/);
  assert.equal(await readFile(join(outputDir, "test-indexnow-key.txt"), "utf8"), "test-indexnow-key");
});

test("keeps trailing slashes for statically exported directory pages", async (t) => {
  const outputDir = await mkdtemp(join(tmpdir(), "bodyres-seo-directory-page-"));
  t.after(() => rm(outputDir, { recursive: true, force: true }));

  await mkdir(join(outputDir, "services", "likuvalnyi-masazh"), { recursive: true });
  await writeFile(
    join(outputDir, "services", "likuvalnyi-masazh", "index.html"),
    "<html><head><title>Лікувальний масаж</title></head><body>Service</body></html>",
    "utf8",
  );

  const result = await createArtifacts({
    outputDir,
    siteUrl: "https://body-re.store",
    siteName: "Body Restore",
    description: "Масажний кабінет в Одесі",
    generatedAt: "2026-07-15T12:00:00.000Z",
  });

  const serviceUrl = "https://body-re.store/services/likuvalnyi-masazh/";
  assert.ok(result.manifest.pages[serviceUrl]);
  assert.deepEqual(result.changes.added, [serviceUrl]);
  assert.match(await readFile(join(outputDir, "sitemap.xml"), "utf8"), new RegExp(serviceUrl));
  assert.match(await readFile(join(outputDir, "llms.txt"), "utf8"), new RegExp(serviceUrl));
  assert.match(await readFile(join(outputDir, "feed.xml"), "utf8"), new RegExp(serviceUrl));
});
