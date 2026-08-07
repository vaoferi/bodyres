# Static SEO Notification Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Побудувати static-only генерацію службових файлів і післядеплойні сповіщення для `https://body-re.store` без видимих змін до сайту.

**Architecture:** Build script аналізує готові HTML у `out/`, порівнює SHA-256 з попереднім production manifest і пише новий manifest та службові файли. FTP deploy не викликає notifier до перевірки live manifest; notifier використовує тільки перевірені змінені URL, а необов’язкові інтеграції звітує окремо.

**Tech Stack:** Node.js 20+, Node test runner, Next.js 16 static export, Python FTP helper, Playwright, Fetch API.

## Global Constraints

- Production тільки static export у `out/`; не додавати SSR, API routes або server runtime.
- Canonical URL: `https://body-re.store`.
- Секрети тільки через environment або `.env.hostinger.local`; у Git вони не потрапляють.
- Не змінювати видимий контент, CSS, компоненти або маршрути.
- Deployment order: build → FTP deploy → live manifest check → notify.
- У mixed worktree stage тільки файли, названі у відповідному task.

---

### Task 1: Тестований аналіз static export

**Files:**
- Create: `tests/seo/artifacts.test.mjs`
- Create: `scripts/seo/artifacts.mjs`
- Create: `scripts/seo/generate-artifacts.mjs`

**Interfaces:**
- Produces: `collectPages(outputDir, siteUrl)`, `createArtifacts({ outputDir, siteUrl, siteName, description, indexNowKey, previousManifest })`.
- Consumes: готові `.html` файли в `out/`.

- [ ] **Step 1: Write the failing test**

```js
test('keeps lastModified for unchanged pages and marks only changed pages', async () => {
  const result = await createArtifacts({ outputDir, siteUrl, previousManifest });
  assert.deepEqual(result.changes.updated, ['https://body-re.store/about']);
  assert.equal(result.manifest.pages['https://body-re.store/'].updatedAt, priorDate);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/seo/artifacts.test.mjs`

Expected: FAIL because `scripts/seo/artifacts.mjs` does not exist.

- [ ] **Step 3: Write minimal implementation**

```js
export async function createArtifacts(options) {
  // Read HTML, hash it, compare the previous manifest and write only static artifacts.
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/seo/artifacts.test.mjs`

Expected: PASS.

- [ ] **Step 5: Commit later with integration task**

### Task 2: Безпечні зовнішні сповіщення

**Files:**
- Create: `tests/seo/notifier.test.mjs`
- Create: `scripts/seo/notifier.mjs`
- Create: `scripts/seo/xmlrpc.mjs`
- Create: `scripts/seo/notify-services.mjs`

**Interfaces:**
- Produces: `retry`, `submitIndexNow`, `pingXmlRpcService`, `notifyServices`.
- Consumes: `.seo/changed-urls.json`, environment configuration and already-live URLs.

- [ ] **Step 1: Write the failing test**

```js
test('retries a temporary IndexNow failure and submits only verified live URLs', async () => {
  const result = await submitIndexNow({ urls: [url], fetchImpl });
  assert.equal(result.submitted, 1);
  assert.equal(attempts, 2);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/seo/notifier.test.mjs`

Expected: FAIL because `scripts/seo/notifier.mjs` does not exist.

- [ ] **Step 3: Write minimal implementation**

```js
export async function retry(operation, { attempts = 3 } = {}) {
  // Retry only transient network, 429 and 5xx failures.
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/seo/notifier.test.mjs`

Expected: PASS.

- [ ] **Step 5: Commit later with integration task**

### Task 3: Інтеграція static build і deploy

**Files:**
- Modify: `scripts/build-static.mjs`
- Modify: `scripts/deploy-static-ftp.py`
- Modify: `package.json`
- Modify: `site.config.ts`
- Modify: `.gitignore`
- Modify: `.env.hostinger.example`

**Interfaces:**
- Consumes: build artifacts and optional `INDEXNOW_KEY`, `GOOGLE_SEARCH_CONSOLE_SITE_URL`, `GOOGLE_SERVICE_ACCOUNT_JSON`, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`.
- Produces: repeatable `npm run build:static`, `npm run seo:notify`, `python scripts/deploy-static-ftp.py --notify`.

- [ ] **Step 1: Update build wrapper**

Call `generate-artifacts.mjs` only after a successful `next build` configured with `NEXT_OUTPUT=export`.

- [ ] **Step 2: Update FTP helper**

Keep current retry/reconnect semantics, add optional `--notify`, wait for live `.well-known/seo-manifest.json`, then invoke notifier only after the manifest response matches the generated build id.

- [ ] **Step 3: Add safe defaults and ignored local state**

Set real production site URL, document non-secret example environment names, and ignore `.seo/`.

- [ ] **Step 4: Verify build output**

Run: `npm run build:static`

Expected: `out/robots.txt`, `out/sitemap.xml`, `out/llms.txt`, `out/feed.xml`, `out/.well-known/seo-manifest.json`.

### Task 4: Documentation, validation and production release

**Files:**
- Modify: `README.md`
- Create: `docs/seo-notification-spec.md`
- Create: `docs/superpowers/plans/2026-07-15-static-seo-notification.md`

- [ ] **Step 1: Document operator workflow**

Describe how optional Google/Telegram secrets affect notification status and how to run a safe deploy.

- [ ] **Step 2: Run full validation**

Run: `node --test tests/seo/*.test.mjs && npm run build:static && npm run ci`

Expected: all tests pass, static output exists and visual smoke passes.

- [ ] **Step 3: Review security and diff**

Run path-limited `git diff --check`, a secret scan over staged paths and a mojibake scan.

- [ ] **Step 4: Commit and deploy**

Stage only server task paths, commit `feat: automate static SEO notifications`, then run `python scripts/deploy-static-ftp.py --notify`.

- [ ] **Step 5: Verify production**

Check root, all service files, manifest, IndexNow key file and notification report; report skipped integrations explicitly.
