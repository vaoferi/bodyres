This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Deployment mode

BodyRes is documented to target `STATIC EXPORT` as the default deployment mode.

- Static export means plain HTML/CSS/JS files.
- Use it when you want the site to run on cheaper shared hosting without a dedicated Node.js server.
- Avoid `SSR / API` for the public site unless there is a concrete requirement that cannot be solved statically.

## Documentation map

- `docs/architecture-decisions.md` — ключові архітектурні рішення та що не можна ламати.
- `docs/build-rules.md` — правила збірки, перевірки та типові блокери середовища.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Static indexation and notification flow

`npm run build:static` creates the production `out/` directory and, after Next.js finishes, writes:

- `/robots.txt`, `/sitemap.xml`, `/llms.txt` and `/feed.xml`;
- `/.well-known/seo-manifest.json` with SHA-256 page state;
- `/<INDEXNOW_KEY>.txt` for IndexNow verification.

The manifest retains `lastmod` for an unchanged page. Only added and changed live URLs are verified and submitted after deployment; removed URLs are recorded but never requested as if they were still live.

### Safe production release

```text
npm run test:seo
npm run build:static
python scripts/deploy-static-ftp.py --notify
```

`--notify` first waits until the production manifest has the local build ID. Only then does it call IndexNow, Google Search Console Sitemap API, Ping-O-Matic, Twingly and optionally WebSub/Telegram. A verification or configured critical service failure returns a non-zero exit code; legacy XML-RPC failure remains visible in the report but does not undo an already successful file upload.

The local report is `.seo/notification-report.json`. It is deliberately ignored by Git.

### Optional environment settings

Use `.env.hostinger.example` as the non-secret field list. Real values belong only in `.env.hostinger.local` or GitHub Actions secrets:

- `INDEXNOW_KEY` — optional; when absent, a persistent local key is generated in `.seo/`.
- `GOOGLE_SEARCH_CONSOLE_SITE_URL` and `GOOGLE_SERVICE_ACCOUNT_JSON` — enable sitemap submission. The service account must have access to `sc-domain:body-re.store`.
- `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` — enable release summaries.
- `WEBSUB_ENABLED=true` — enables WebSub only when a real hub is configured.

Do not use Google Indexing API for ordinary site pages: it is not the supported API for this purpose.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
