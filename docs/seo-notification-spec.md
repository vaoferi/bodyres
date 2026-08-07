# SPEC — статична інфраструктура індексації та сповіщень

## Ціль

Після кожного production static deploy сайт має публікувати коректні службові файли, визначати лише фактично змінені URL і безпечно повідомляти підтримувані сервіси. Видима сторінка та її контент не змінюються.

## Контекст

- Production — `https://body-re.store`, звичайний Hostinger static hosting у `domains/body-re.store/public_html`.
- Канонічний production payload — лише `out/`, сформований через `npm run build:static`.
- Поточні `/robots.txt`, `/sitemap.xml` і `/llms.txt` на production повертають `404`.
- Частково створені локальні SEO-файли містять placeholder `https://example.com` і не відповідають потрібному потоку deploy → live verification → notify.
- `.env.hostinger.local` уже є локальним сховищем FTP-доступу; секрети не потрапляють у Git.

## Що змінюємо

- Генерацію в `out/`: `robots.txt`, `sitemap.xml`, `llms.txt`, `feed.xml`, IndexNow key file та `.well-known/seo-manifest.json`.
- Якщо production manifest повертає підтверджений `404`, скидати локальний попередній manifest перед build, щоб перший опублікований URL не був пропущений IndexNow.
- SHA-256 маніфест HTML-сторінок: визначення added, updated і removed URL з чесним `lastmod`.
- Післядеплойний notifier: перевіряє live URL, подає змінені URL до IndexNow, актуальний sitemap — у Google Search Console, викликає XML-RPC Ping-O-Matic і Twingly та може надсилати підсумок у Telegram.
- Безпечні retries для тимчасових помилок, звіт у `.seo/`, health-check legacy XML-RPC endpoint-ів без production spam.
- FTP deploy helper виконує build, deploy, очікування доступності маніфесту та notify в правильному порядку.
- Документацію запуску та secrets.

## Що не змінюємо

- Дизайн, HTML-контент, тексти, маршрути, форми, клієнтський JavaScript і API сайту.
- Production не переходить на SSR, Node runtime, БД чи API routes.
- Не використовуємо Google Indexing API для звичайних статичних сторінок.
- Не активуємо застарілі ping endpoints без окремого health-check.

## Ризики

- Якщо notification запустити до завершення FTP deploy, зовнішні сервіси отримають URL, які ще не працюють.
- Якщо `SITE_URL` або IndexNow key задані неправильно, службові файли можуть посилатися не на production.
- Google Search Console і Telegram потребують окремо доданих production secrets; без них ці кроки чесно позначаються як skipped, а не імітуються.
- Робоче дерево містить багато сторонніх змін; до коміту додаються лише узгоджені SEO/deploy файли.

## План

1. Написати тести для детектора змін та безпечного retry/notification потоку.
2. Реалізувати модулі генерації й notification, потім інтегрувати їх у static build та FTP deploy.
3. Оновити локальні приклади конфігурації та документацію без секретів.
4. Виконати static build, Playwright smoke, перевірку diff/encoding/secrets.
5. Закомітити лише серверні файли задачі, виконати FTP deploy і перевірити production URL та notification report.

## Перевірка

- `node --test tests/seo/*.test.mjs`
- `npm run build:static`
- `npm run ci`
- `python scripts/deploy-static-ftp.py` лише після зелених перевірок.
- HTTP smoke для `/`, `/robots.txt`, `/sitemap.xml`, `/llms.txt`, `/feed.xml`, `.well-known/seo-manifest.json` та IndexNow key file.

## Критерії готовності

- Немає видимих змін до сайту.
- Незмінена HTML-сторінка не отримує фальшивий новий `lastmod`.
- Сповіщення не виконується, доки deploy не підтвердив доступність live manifest.
- Всі required production URL віддаються з `200`.
- Помилка додаткового зовнішнього сервісу не маскується і не робить успішним неповний deploy.
