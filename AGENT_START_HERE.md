# BodyRes — local tooling entrypoint

Використовуй цей файл лише коли задача зачіпає router/NAS preview, Hostinger production, Vaultwarden/Bitwarden або MCP/provider tooling. Universal workflow живе в `AGENTS.md`; project architecture — у `PROJECT_RULES.md`.

## Спочатку встанови current state

Tool/provider topology є version- і session-sensitive. Перед зміною конфігурації:

1. перевір, які connectors/CLI реально доступні зараз;
2. перевір current project config і relevant docs;
3. відрізняй session-level відсутність tool від поломки project config;
4. не відновлюй історичний workaround лише тому, що він колись був записаний у цьому repo.

## Hostinger production

- Production BodyRes — static export у Hostinger `public_html`.
- Canonical source для current deploy flow: `README.md`, `docs/architecture-decisions.md`, `docs/build-rules.md`, `scripts/deploy-static-ftp.py` і current `.github/workflows/static-production.yml`.
- Local production credentials/config можуть жити в gitignored `.env.hostinger.local`; GitHub workflow використовує GitHub Actions secrets.
- Не друкуй credential values у chat/docs/logs і не запускай deploy без явної авторизації.

## NAS / router preview

Документований BodyRes preview: `http://nlmhelp.keenetic.link:18084/`.

Остання зафіксована project mapping була `18084/TCP -> 10.0.1.12:8080`. Це корисний locator, але перед network/router mutation перевір current running config: mapping могла змінитися після дати запису.

Ролі не змішувати:

- router — external access / port forwarding;
- Synology/NAS — preview/container runtime;
- Hostinger — production static hosting.

Якщо preview не показує свіжі файли, спочатку встанови, який runtime/container реально віддає endpoint, а не переписуй UI повторно.

Для fallback доступу до Synology historical project path використовував QuickConnect/DSM. Якщо він знову потрібний, перевір current availability і бери credentials з approved secret source; не записуй їх у docs або shell snippets.

## Vaultwarden / Bitwarden

Historical canonical Vaultwarden endpoint у project notes: `https://vault.nlm.help`. Перед використанням перевір, що endpoint і certificate chain зараз валідні.

Vaultwarden — optional operational credential source для router/NAS/Hostinger, коли він реально доступний і це потрібно задачі. Не роби його обов'язковим замість working gitignored local env.

Корисні record names, які були зафіксовані для пошуку без повторного запиту секретів у owner:

- `NLM Keenetic Router - nlmhelp.keenetic.link`;
- `NLM Synology NAS - QuickConnect/DSM`;
- `BodyRes Hostinger - FTP/API`;
- `BodyRes Hostinger API token`.

Назва record не доводить, що він досі існує або актуальний: перед використанням перевір current credential store.

- Не проси owner повторно надсилати secret у chat, якщо approved local store або доступний credential manager уже містить потрібний запис.
- Не вважай помилку конкретного CLI/MCP автоматично проблемою самого Vaultwarden: перевір client/tool availability окремо.
- Не зберігай TLS-disable або інший insecure workaround глобально. Тимчасовий diagnostic workaround потребує явного пояснення й мінімального scope.
- У persistent docs дозволені назви credential records і порядок дій, але не secret values.

Historical machine-specific CLI paths, certificate errors та одноразові item-verification результати не є current hard rules; перевіряй їх заново, якщо вони знову стають релевантними.

## Headroom / MCP

Historical local proxy convention був `http://127.0.0.1:9090/<namespace>/`. Не вважай його гарантовано чинним.

Раніше через нього були зафіксовані Hostinger namespaces: `hostinger-api`, `hostinger-hosting`, `hostinger-domains`, `hostinger-dns`, `hostinger-billing`, `hostinger-reach`. Це discovery hints, не гарантований current tool list.

Перед використанням Hostinger/MCP namespace:

1. перевір current connector/tool list;
2. перевір current local/provider config;
3. використовуй існуючий route, якщо він підтверджений;
4. не створюй новий proxy/config лише тому, що поточна session не експонує стару назву tool.

## Коротке правило

Current code/config/tool evidence > цей operational note > історичні workaround-и.
