import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import test from "node:test";

// NLM-212: Business moved from Фонтанська дорога 58/3 to вул. Івана Фунтового 68/1.
// Google rejects a relocation while official sources still advertise the old address,
// so this gate must fail the build BEFORE deploy if the old NAP leaks back into any
// source that feeds crawlable output (page markup, JSON-LD, metadata, sitemap).
const FORBIDDEN = [
  "Фонтанська дорога",
  "Фонтанськой дороги",
  "58/3",
  "instagram.com/bodyrestore",
  "facebook.com/bodyrestore",
];

const REQUIRED = [
  "вул. Івана Фунтового, 68/1",
  "+380968592465",
  "https://body-re.store/",
  "https://www.instagram.com/body_restore_odesa",
];

// Only files that actually reach the crawler. Build tooling, tests, docs and the
// vendored Sharp donor template are excluded so historical notes stay allowed.
const CRAWLABLE_SOURCES = [
  "site.config.ts",
  "lib/seo/schema.ts",
  "src/components/Hero.tsx",
  "src/components/CTA.tsx",
  "src/app/services/page.tsx",
  "src/app/services/[slug]/page.tsx",
  "src/app/layout.tsx",
  "src/app/page.tsx",
];

const repoRoot = join(import.meta.dirname, "..", "..");

test("canonical NAP: crawled sources carry only the current address", async () => {
  const offenders = [];

  for (const relativePath of CRAWLABLE_SOURCES) {
    let contents;
    try {
      contents = await readFile(join(repoRoot, relativePath), "utf8");
    } catch (error) {
      if (error.code === "ENOENT") {
        continue;
      }
      throw error;
    }

    for (const needle of FORBIDDEN) {
      if (contents.includes(needle)) {
        offenders.push(`${relativePath} contains "${needle}"`);
      }
    }
  }

  assert.deepEqual(
    offenders,
    [],
    `Old/incorrect NAP leaked into crawlable sources:\n${offenders.join("\n")}`,
  );
});

test("canonical NAP: site.config.ts stays the single source of truth", async () => {
  const config = await readFile(join(repoRoot, "site.config.ts"), "utf8");

  for (const value of REQUIRED) {
    assert.ok(config.includes(value), `site.config.ts must declare ${value}`);
  }
});
