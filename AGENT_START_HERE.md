# BodyRes — точка входу для агентів

Цей файл потрібен, щоб наступний агент не вигадував власний шлях до Vaultwarden, Bitwarden CLI або MCP-проксі.

## Перед будь-якою роботою

1. Прочитай `AGENTS.md`.
2. Прочитай `README.md`.
3. Прочитай `DEPLOY_INSTRUCTIONS.md`.
4. Якщо задача зачіпає рішення по архітектурі або деплою, подивись `docs/architecture-decisions.md` і `SPEC.md`.

## Vaultwarden / Bitwarden CLI

- Канонічний сервер для Vaultwarden: `https://vault.nlm.help`.
- Не підставляй у `bw` локальний HTTP-URL типу `http://nlmhelp.keenetic.link:18088`.
- Якщо MCP Bitwarden повертає `spawn bw ENOENT`, це не доказ поломки Vaultwarden. На Windows перевір локальний CLI напряму: `C:\Users\vaoferi\AppData\Roaming\npm\bw.cmd`.
- На цій машині `vault.nlm.help` може віддавати Synology self-signed certificate (`CN=synology`). Тоді `bw`/`curl` падають на trust chain, а не на логіні. Нормальне рішення - валідний сертифікат на reverse proxy або довірений Synology CA.
- Тимчасовий workaround для термінового запису секретів: запускати тільки один процес `bw` з `NODE_TLS_REJECT_UNAUTHORIZED=0`, не зберігати це глобально і прямо називати workaround.
- Якщо `bw` поводиться дивно, спочатку перевір клієнтський стан і локальні ключі, а не переписуй контейнер.
- Якщо треба звірити NAS-сервіс, починай з `docker ps`, `docker logs` і стану SQLite/health, а не з повторної “реінкарнації” логіну.
- Не друкуй у чаті паролі, токени або інші креденшели.
- На цій машині `bw` може показувати `Invalid key` / `Key algorithm does not match encrypted data type`, але item creation/get-by-id все одно може спрацювати. Для перевірки запису краще звіряти конкретний `item id`, а не покладатися лише на `list`.
- Актуальні записи для BodyRes, які мають існувати у Vaultwarden:
  - `NLM Keenetic Router - nlmhelp.keenetic.link`;
  - `NLM Synology NAS - QuickConnect/DSM`;
  - `BodyRes Hostinger - FTP/API`;
  - `BodyRes Hostinger API token`.
- 2026-07-02 ці чотири записи створені і перевірені через `bw get item <id>`.
- Роутер перевірено через web panel і `/rci/show/running-config`: BodyRes preview має правило `18084/TCP -> 10.0.1.12:8080`.
- Якщо треба повторно працювати з цими доступами, шукай записи у Vaultwarden за назвами вище, а не проси користувача знову надсилати паролі в чат.

## Headroom / Hostinger MCP

- Базовий проксі-шлях: `http://127.0.0.1:9090/`.
- Існуючі namespace’и для маршрутів мають іти через Headroom, а не в обхід нього.
- Hostinger namespace’и, які мають залишатися проксійованими через Headroom: `hostinger-api`, `hostinger-hosting`, `hostinger-domains`, `hostinger-dns`, `hostinger-billing`, `hostinger-reach`.
- Не вигадуй нові URL, якщо потрібний роут уже є в проксі.

## Що вважати джерелом правди

- Для поточного сайту цільовий режим — `STATIC EXPORT`.
- Для деплой-нотаток і старих рішень дивись `DEPLOY_INSTRUCTIONS.md`.
- Для архітектурних рішень — `docs/architecture-decisions.md`.

## Коротке правило

Якщо є сумнів, спершу звірся з цим файлом і з уже наявними доками, а не збирай нову схему з нуля.
