# PROJECT_RULES.md — BodyRes

Цей файл містить лише правила й факти, специфічні для `vaoferi/bodyres`. Універсальна поведінка агента живе в root `AGENTS.md` та conditional Vaoferi skills.

## 1. Read order і джерела правди

Перед нетривіальною зміною:

1. `AGENTS.md` — universal Vaoferi contract.
2. `PROJECT_RULES.md` — цей файл, BodyRes hard/project rules.
3. `README.md` — current build/deploy entrypoint.
4. `docs/architecture-decisions.md` — довгоживучі архітектурні рішення.
5. `docs/build-rules.md` — verified build/runtime quirks та команди.
6. `massage_business_info.md` — source of truth для бізнес-контенту.
7. Current code/config/tests і фактичний runtime мають пріоритет над старими `SPEC.md`, status notes та історичними workaround-ами.

Для UI/design задач спочатку завантаж `vaoferi-design-skill`, потім застосовуй локальні правила нижче.

## 2. Current stack

`package.json` є authority для exact versions. На baseline Start Here 0.2.0 проєкт використовує:

- Next.js `16.2.9`, App Router;
- React / React DOM `19.2.4`;
- TypeScript;
- Tailwind CSS `4`;
- Playwright для browser/E2E verification.

Не покладайся на пам'ять про старий Next.js. Перед version-sensitive framework зміною звір exact installed version і актуальну документацію цієї версії. Якщо локально доступні docs у `node_modules/next/dist/docs/`, вони є preferred project-local reference; інакше використовуй official Next.js docs для встановленої версії та враховуй deprecation notices.

## 3. Product/content

- Основна мова UI та публічного контенту — українська.
- Бізнес-контент, адреса, контакти й перелік послуг беруться з `massage_business_info.md` або з явно новішого owner-approved source; не дублюй і не вигадуй бізнес-факти у технічних docs.
- Поточна публічна поверхня — класичний one-page BodyRes із Sharp-based template/composition.

## 4. Production architecture — STATIC EXPORT

Production target — **Next.js static export**, а не постійний Node.js/SSR/API runtime.

- `next.config.ts` вмикає `output: "export"` через `NEXT_OUTPUT=export`, `trailingSlash` і `images.unoptimized` для static export.
- Production output — `out/`.
- Не переводь public site на SSR/API/обов'язковий Node runtime без окремого owner/architecture decision.
- Не додавай server-only Next.js feature, якщо вона робить static export неможливим, без явного рішення про зміну production architecture.
- Canonical production hosting — Hostinger static hosting / FTP flow, не GitHub Pages.

## 5. Current UI surface і design donors

- Видимий legacy/Sharp template: `public/sharp-template/Sharp/index.html` та його `assets/`.
- Root Next.js page/iframe integration живе в `src/app/page.tsx`.
- `Elements/` — design donor/source library, **не runtime dependency**. Не підключай donor assets напряму з runtime/build; потрібний матеріал спочатку переноситься у project-owned `public/`, `src/` або іншу робочу теку.
- Existing BodyRes visual language і поточний Sharp composition мають пріоритет над довільним redesign, якщо owner не просив redesign.
- Для hero/services/testimonials/forms/contacts спочатку перевір existing project/donor patterns, але не копіюй сторонній template цілком.
- QR-коди не є primary contact UI; для звичайних каналів зв'язку використовуй нормальні links/icons, якщо інше не потрібне конкретному use case.
- Перед CSS/layout/component зміною знайди existing style owner та consumers; далі діє `vaoferi-design-skill`.

## 6. Cache-busting / embedded Sharp template

BodyRes має окрему iframe/template поверхню, тому green build не доводить, що користувач уже бачить новий asset.

- Після змін `public/sharp-template/Sharp/index.html`, CSS, JS або image paths перевір відповідні cache-buster query values.
- Якщо змінюється root iframe path/integration — перевір `src/app/page.tsx` окремо.
- `/sharp-template/Sharp` — внутрішня template surface, не окрема public SEO page; не додавай її в sitemap/feed/`llms.txt`/SEO manifest.

## 7. Build і verification

Current project commands:

- `npm run build` — preview/build path (`next build --webpack`).
- `npm run build:static` — canonical production static export.
- `npm run test:seo` — SEO/static notification logic tests.
- `npm run ci` — Playwright smoke/E2E через static-export test server.
- `BODYRES_TEST_URL=<url> npm run test:e2e` — перевірка вже існуючого live/preview URL без локального server ownership assumptions.

`docs/build-rules.md` містить verified environment quirks (UNC/SMB, optional native dependencies, Synology `@eaDir`, cache busting). Не перетворюй environment failure на UI/code fix без доказу.

Загальний `npm run lint` історично зачіпав donor/minified sources; поки lint config не очищений, для маленьких змін використовуй scoped lint плюс релевантні build/browser gates. Не називай повний lint green, якщо запускав тільки subset.

UI Done вимагає browser/render evidence; HTTP 200 або build alone недостатні.

## 8. Preview / runtime separation

- `http://nlmhelp.keenetic.link:18084/` — documented NAS/container preview BodyRes; перед використанням як acceptance surface перевір, що endpoint реально доступний і віддає потрібну версію.
- Router, Synology/NAS і Hostinger — різні ролі:
  - router — external access/port forwarding;
  - Synology/NAS — preview/container runtime;
  - Hostinger — production static files.
- Не вважай локальний `localhost:3000` production evidence.
- Development runtime на цій машині не підтримується: DEV/HMR, build і gates виконуються на canonical NAS checkout через `projectctl` (`dev ensure bodyres`, `preview refresh bodyres`), а стабільний preview лишається `http://nlmhelp.keenetic.link:18084/`.

## 9. Deploy

Canonical production sequence, якщо production deploy явно авторизований:

1. `npm run test:seo`;
2. `npm run build:static`;
3. `npm run ci`;
4. inspect output/diff;
5. `python scripts/deploy-static-ftp.py --notify` або current reviewed GitHub Actions Hostinger workflow;
6. verify production surface after upload before declaring deploy complete.

Production secrets/config живуть у gitignored `.env.hostinger.local` або GitHub Actions secrets. `.env.hostinger.example` — лише safe field list.

Не запускай production deploy, не міняй secrets і не вмикай новий automatic production trigger без явного approval.

## 10. Tool/provider notes

- `AGENT_START_HERE.md` — BodyRes-specific router/NAS/Hostinger/Vaultwarden operational notes. Це project/tooling context, не universal doctrine.
- Tool/MCP names, local paths, certificate workarounds і доступність CLI є version/session-sensitive: перевір current environment до використання.
- `.claude/settings.local.json` — Claude/machine permission overlay. Не переносити його allowlist у `AGENTS.md` або загальні project rules і не вважати список дозволів архітектурою проєкту.
- Не змінюй provider/MCP config лише тому, що конкретний chat/session не бачить tool; спочатку перевір реальну конфігурацію й доступність.

## 11. Secrets

- Real credentials не коміть і не копіюй у docs/issues/chat/logs.
- Gitignored `.env.hostinger.local` та інші project-approved local secret stores є нормальним робочим механізмом.
- Не змушуй мігрувати working local secret у Vaultwarden лише заради ceremony.
- Vaultwarden можна використовувати для router/NAS/інших operational credentials, якщо він реально доступний і це зручно для конкретної задачі.

## 12. Hard stops

STOP і назви blocker перед mutation, якщо:

- зміна вимагає SSR/API/Node production runtime замість approved static export;
- production deployment/secret/permission change не авторизований;
- project/provider tool topology суперечить docs і current state не встановлений;
- required browser/runtime evidence недоступне для high-risk UI/deploy change;
- зміна ризикує втратити business content або donor/runtime asset references без traced consumers.
