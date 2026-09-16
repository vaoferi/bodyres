# BodyRes

BodyRes is a Next.js site for a massage business in Odesa. The repository currently targets **Next.js static export** for production and publishes plain HTML/CSS/JS to Hostinger.

## Start here

For agent work read, in order:

1. `AGENTS.md` — universal Vaoferi contract;
2. `PROJECT_RULES.md` — BodyRes-specific architecture, design, build and deploy invariants;
3. `docs/architecture-decisions.md` — durable architecture decisions;
4. `docs/build-rules.md` — verified build/runtime quirks;
5. `massage_business_info.md` — business/content source.

`AGENT_START_HERE.md` is only for router/NAS/Hostinger/Vaultwarden/MCP operational tasks. `CLAUDE.md` is a thin provider overlay.

## Current stack

Exact versions live in `package.json`. Current baseline uses Next.js 16.2.9 / React 19.2.4 / TypeScript / Tailwind CSS 4, with Playwright for browser verification.

For version-sensitive Next.js behavior, use documentation for the installed version rather than older framework assumptions.

## Development

```bash
npm ci
npm run dev
```

Local development may use `http://localhost:3000`; it is not production acceptance evidence.

## Production mode: STATIC EXPORT

The public site is intended to run without a dedicated Node.js server.

`NEXT_OUTPUT=export` makes `next.config.ts` produce the `out/` directory with static HTML/CSS/JS. Do not introduce SSR/API/server-only requirements without a separate architecture decision.

Canonical production checks:

```bash
npm run test:seo
npm run build:static
npm run ci
```

Production deployment, only when explicitly authorized:

```bash
python scripts/deploy-static-ftp.py --notify
```

The script uploads the reviewed static export to Hostinger, verifies the production manifest/build state, then runs configured notification/indexing steps. A successful upload alone is not the release acceptance gate; verify the live site afterwards.

## Static indexation and notification flow

`npm run build:static` generates the production `out/` directory and writes/updates:

- `/robots.txt`, `/sitemap.xml`, `/llms.txt`, `/feed.xml`;
- `/.well-known/seo-manifest.json` with page SHA-256 state;
- `/<INDEXNOW_KEY>.txt` when IndexNow verification is configured.

The manifest keeps `lastmod` stable for unchanged pages. Only added/changed live URLs are notified after deployment; deleted URLs are recorded but are not requested as if still live.

For this project's `trailingSlash` static model, exported `.../index.html` pages are represented externally as slash URLs. `/sharp-template/Sharp/` is an internal iframe/template surface and must not become a separate sitemap/feed/manifest page.

Do not use Google Indexing API for ordinary site pages; the project uses the supported sitemap/Search Console path where configured.

## Secrets/config

Use `.env.hostinger.example` only as the non-secret field list. Real values belong in gitignored `.env.hostinger.local` or GitHub Actions secrets.

Examples of optional integration settings include IndexNow, Google Search Console, Telegram release summaries and WebSub. Never commit or paste real credential values into repository documentation.

## GitHub Actions

- `.github/workflows/preview.yml` — PR/main static export + Playwright smoke CI.
- `.github/workflows/vaoferi-start-here.yml` — canonical Start Here contract/drift verification.
- `.github/workflows/static-production.yml` — explicitly manual Hostinger production deployment. Do not enable an automatic production trigger without owner approval.

GitHub Pages is not the canonical production target for BodyRes.
