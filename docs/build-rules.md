# Правила збірки BodyRes

## Мета
Зберегти BodyRes у режимі `STATIC EXPORT` і не дати наступному агенту зламати збірку через зайві runtime-залежності або невдалий шлях запуску.

## Базові правила

1. Публічний сайт залишається статичним. Не переводити його на `SSR / API`, якщо немає окремого рішення.
2. Перед build перевіряй, що `node_modules` повний. Якщо `lightningcss` або інший нативний пакет відсутній, спочатку віднови залежності.
3. Канонічна команда preview/Docker-збірки для цього репо зараз — `npm run build`, а в `package.json` вона веде на `next build --webpack`. Це зроблено саме для обходу Windows `UNC` / `outside of root directory`, який ламав Turbopack.
4. Якщо `next build --webpack` падає на `Cannot find module '../lightningcss.win32-x64-msvc.node'`, це не проблема UI-коду. Це означає, що треба підтягнути optional native dependency.
5. Якщо Windows `UNC`-шлях все ще ламає збирання, не міняй логіку сторінки, а змінюй середовище збірки або шлях запуску.
6. У BodyRes видимий шаблон лежить у `public/sharp-template/Sharp/index.html`, а не в `Vaoferi/nlm/public_html`. Не плутай ці дві поверхні.
6.1. `public/sharp-template/Sharp/index.html` є внутрішнім документом iframe. Він не має потрапляти в sitemap, feed, `llms.txt` або SEO manifest як окрема сторінка, інакше пошуковики отримають дубль головної.
7. Після правок у `public/sharp-template/Sharp/index.html` / `assets/css/*` / `assets/img/*` обов’язково піднімай cache-buster у `src/app/page.tsx`, інакше iframe може показувати стару версію навіть після змін на диску.
8. Якщо змінюються аватарки відгуків, перевіряй імена файлів у `public/sharp-template/Sharp/assets/img/reviews/` та відповідність шляхів у HTML.
9. Не тягни `Elements/` у runtime або build як live dependency. Якщо якийсь донорський файл потрібний на сайті, спочатку копіюй його в робочу теку (`public/`, `src/` або інший workspace-asset path), і вже звідти посилайся в коді.
10. У цій сесії `next build` на Turbopack ламався на Windows `UNC` / `outside of root directory`. Робочий обхід, який уже підтвердився, - `next build --webpack` через `npm run build`.
11. Якщо live URL на `http://nlmhelp.keenetic.link:18084/` не показує свіжі зміни після зеленої збірки, це означає, що ще не оновився окремий NAS/container runtime. У такому випадку спочатку перевіряй канал віддачі сторінки, а не знову міняй UI.
12. Для public/sharp-template/Sharp будь-яка зміна HTML/CSS/зображень має супроводжуватися оновленням cache-buster у `src/app/page.tsx`. Без цього iframe може показувати стару версію навіть коли файли на диску вже нові.
13. У цьому розборі live шаблон вже віддавав оновлений `public/sharp-template/Sharp/index.html`, але iframe на головній ще лишався на старому `v=...`, тому “build green” і “visible on site” треба рахувати окремо.
14. Якщо під час build видно багато попереджень про `LF will be replaced by CRLF`, це не є блокером збірки само по собі, але воно не повинно маскувати справжні помилки `UNC/root`, `lightningcss` або runtime deployment.
15. На Synology перед Docker build обов’язково має працювати `.dockerignore` з `**/@eaDir`, `**/@eaDir/**` і `**/*@SynoEAStream`. Інакше Next.js бачить `src/app/@eaDir` як parallel route і падає з `Missing required default.js file for parallel route at app/@eaDir`.
16. `Elements/` є донорською текою, а не runtime dependency. Для Docker build вона має бути виключена з context через `.dockerignore`, а потрібні медіа треба копіювати в `public/` або іншу робочу теку сайту.
17. Доступи Hostinger зберігати тільки в локальному `.env.hostinger.local`. Цей файл має бути в `.gitignore` і `.deployignore`; у git дозволений тільки `.env.hostinger.example` без секретів.
18. Для звичайного Hostinger hosting використовувати тільки static export (`out/`) і FTP-завантаження в `public_html`. Не додавати SSR, API routes або Node runtime для production без окремого рішення.
19. Перед FTP-деплоєм на `body-re.store` перевіряти `.deployignore`, щоб не завантажити `.env*`, `Elements/`, `.git`, `node_modules`, `.next` або службові `@eaDir`.
20. Канонічна команда для production static export — `npm run build:static`. Вона кросплатформно виставляє `NEXT_OUTPUT=export`, чистить `out/` і запускає `next build --webpack`.
21. Канонічна команда smoke/CI — `npm run ci`. Вона запускає Playwright через static export test server, тому перевіряє саме модель звичайного хостингу, а не Node runtime.
22. Якщо треба перевірити вже живий сайт або NAS preview, запускай `npm run test:e2e` з `BODYRES_TEST_URL=<url>`. У такому режимі Playwright не піднімає локальний сервер і тестує заданий URL.
23. FTP-деплой на Hostinger виконуй тільки після зеленого `npm run ci` командою `python scripts/deploy-static-ftp.py`. Скрипт читає секрети з `.env.hostinger.local`, не з коду і не з git.
24. Якщо користувач прямо каже “не роби збірку” або “спочатку виконай ще задачі в черзі”, не запускай `npm run ci`, `npm run test:e2e` без `BODYRES_TEST_URL`, `scripts/e2e-static-server.mjs` або `npm run build:static`: усі ці шляхи можуть зібрати `out/`. У такому режимі дозволені тільки статичні перевірки (`git diff --check`, scoped lint, пошук mojibake, HTML-count checks), доки користувач не дозволить build.
25. `scripts/e2e-static-server.mjs` завжди запускає `scripts/build-static.mjs` перед стартом тестового сервера. Це корисно для CI, але не підходить для черги правок “без збірки”.
26. На Windows з UNC-шляху команди через `cmd.exe` можуть стартувати з `C:\Windows`, навіть якщо `workdir` задано правильно. Для npm/node-команд використовуй `cmd /c "pushd \\nas\homes\vaoferi\Work\BodyRes && <command> && popd"` або mapped drive.
27. Загальний `npm run lint` зараз лінтить також донорські `Elements/` і `skills-repos/`, тому може падати на сторонніх/minified JS незалежно від поточної правки. Для локальної перевірки маленької зміни використовуй scoped lint, наприклад `npx eslint tests/e2e/bodyres-smoke.spec.ts public/sharp-template/Sharp/assets/js/main.js`, а окремо треба винести донорські теки в ignore/config cleanup.
28. Якщо змінено CSS/JS у `public/sharp-template/Sharp/assets/`, оновлюй cache-buster саме для відповідного файлу в `public/sharp-template/Sharp/index.html`: `style.css?v=...`, `responsive.css?v=...`, `main.js?v=...`. Якщо змінено root iframe path — окремо оновлюй `src/app/page.tsx`.
29. Для сервісних карток не використовувати fake-link `href="#"` тільки заради клікабельності. Поточний патерн: `.single-services-item` отримує `role="button"`, `tabindex="0"`, `aria-expanded`, а текст відкривається класом `.is-touch-open` на tap/keyboard; desktop hover лишається тим самим.
30. Після будь-якого масового редагування HTML перевіряй хоча б кількість парних тегів для ризикових елементів (`<a>`/`</a>`, `<div>`/`</div>`) і `git diff` по сусідніх секціях. Це захищає від прихованої поломки DOM після broad replace.
31. Кнопка “Оцінити нас у Google” має вести на прямий Google Business review/profile URL, якщо він відомий. Якщо direct review URL ще не зафіксований у проєкті, допустимий fallback — Google Maps search по назві й адресі, але це треба називати fallback, а не “точним посиланням на створення відгуку”.
32. Для доступів до роутера, Synology, Hostinger або Vaultwarden не створювати нову схему в чаті. Спочатку читати `AGENT_START_HERE.md`, потім брати секрети з Vaultwarden. У документації дозволені тільки URL, item names і порядок дій без паролів.
33. `http://nlmhelp.keenetic.link:18084/` — це NAS/container preview BodyRes. Якщо треба зробити правку видимою там, недостатньо змінити HTML у workspace: треба оновити той runtime, який віддає NAS port `8080`.
34. Router/Synology/Hostinger не взаємозамінні:
   - router відповідає за доступ і port forwarding;
   - Synology/NAS відповідає за preview/container runtime;
   - Hostinger production приймає тільки static export у `public_html`.
35. Якщо потрібен fallback доступ до Synology, використовуй QuickConnect/DSM шлях з Vaultwarden-обліковими даними. Не записуй ці дані в `.env`, docs, git або shell snippets.
36. На UNC/SMB static build може тривати понад 180 секунд: 2026-07-15 оптимізований build витратив близько 159 секунд ще до запуску test server. `playwright.config.ts` має чекати щонайменше 300 секунд; це тестовий timeout, не production workaround.

## Рекомендований порядок

```text
1. npm install --include=optional
2. npm run build
3. npm run build:static
4. npm run ci
5. якщо Turbopack скаржиться на UNC/root path, запускати build з mapped drive (`X:\`) або з локального клону, не з голого UNC через `cmd.exe`
6. перевірити diff і visual QA
```

## Що не робити

- Не додавати `SSR` тільки для того, щоб build “точно спрацював”.
- Не маскувати build-помилки змінами в CSS/HTML, якщо причина в середовищі.
- Не вважати успіхом частковий build або попереднє проходження.
- Не робити висновок про “невидимі зміни”, поки не перевірено cache-buster iframe і не перезапущено той процес, який реально віддає сайт.
- Не підключати `Elements/` напряму з runtime-коду або збірки.

## Знахідки з цього розбору

Ці пункти вже реально ламали збірку або видимість результату, тому їх треба вважати обов’язковими перевірками перед наступним запуском.

1. **GitHub Actions preview не можна будувати на неіснуючому action.**
   - У цьому репо workflow падав на `railway-dev-actions/railway-up@v0.0.1`, бо такого action не існує.
   - Якщо workflow має деплоїти прев’ю, треба або використовувати перевірений офіційний CLI/Action, або прибрати deploy-крок і залишити лише build.

2. **`RAILWAY_TOKEN` не можна припускати “за замовчуванням”.**
   - Коли secret відсутній або порожній, Railway CLI завершується з `Invalid RAILWAY_TOKEN`.
   - Отже, будь-який Railway-пайплайн має або явно вимагати цей secret, або завершуватися раніше з чесним повідомленням, що деплой неможливий.

3. **Успішний GitHub build не означає, що live URL вже оновився.**
   - Для BodyRes видимий результат на `http://nlmhelp.keenetic.link:18084/` залежить від окремого NAS/container deployment path.
   - Якщо змінено тільки GitHub workflow, але не NAS-контейнер, сайт у браузері може залишатися старим.

4. **Історичні великі файли можуть зламати push, навіть якщо поточна зміна маленька.**
   - У цьому проєкті історичний `Elements/sources/psd/03_Home_Massage_Salon.psd` перевищував ліміт GitHub і блокував пуш.
   - Для публікації/preview краще використовувати чистий snapshot або репозиторій без важкої історії `Elements`, якщо потрібно просто доставити поточний стан.

5. **GitHub workflow і NAS deploy треба тримати розділеними в голові.**
   - Якщо ціль - показати зміни на live URL, перевіряй саме той канал, який реально оновлює NAS/service, а не лише workflow success.
   - Не плутай “build green” з “site visible”.

6. **Мобільне меню не повинно мати власний скрол, якщо там вистачає місця для списку посилань.**
   - У цьому шаблоні `#navbarDefault` на малих екранах мав `overflow-y: scroll`, через що з’являвся окремий внутрішній scrollbar.
   - Для BodyRes це сприймається як зайва UI-шумність: меню має розкриватися у висоту без власного скролу, а скрол має лишатися лише в усьому документі.

7. **Окремо перевіряй root iframe і прямий шаблон, бо вони можуть жити на різних кешах/перезапусках.**
   - У цьому розборі `public/sharp-template/Sharp/index.html` уже віддавав нові тексти і зображення при прямому fetch, але iframe на `/` ще тримав старий `v=...`.
   - Отже, для видимого результату треба не лише правити файли, а й оновлювати cache-buster у root та перезапускати саме той runtime, який реально віддає сайт.

8. **Synology `@eaDir` ламає Next.js build, якщо потрапляє в Docker context.**
   - Помилка виглядає як `Missing required default.js file for parallel route at app/@eaDir`.
   - Це не проблема маршруту сайту. Це службова тека Synology, яку треба виключати через `.dockerignore`.
   - Мінімальні правила: `**/@eaDir`, `**/@eaDir/**`, `**/*@SynoEAStream`.

9. **На NAS Docker CLI доступний не з дефолтного PATH і потребує root-доступу до socket.**
   - Використовуй `/usr/local/bin/docker` або `/usr/local/bin/docker-compose`.
   - Якщо користувач `vaoferi` отримує `permission denied` на `/var/run/docker.sock`, запускай через `sudo`, не вигадуй новий deploy path.

10. **У відгуках зірки мають бути тільки під іменем.**
   - Верхні `.review-stars` у тексті відгуку дублювали нижні `.bio-stars`.
   - Для цього дизайну залишати тільки нижній ряд зірок біля імені, щоб блок не виглядав як два рейтинги від однієї людини.

11. **Hostinger production не є VPS.**
   - Production target `https://body-re.store/` приймає готові статичні файли в `public_html`.
   - Не запускати там `next start`, Docker, Node server або server-side routes.

12. **`next export` більше не є командою для цієї версії Next.**
   - Локальна документація Next 16 вказує використовувати `output: 'export'` у `next.config`.
   - У BodyRes це вмикається тільки через `NEXT_OUTPUT=export`, щоб Docker/NAS preview лишався `standalone`.

13. **CI має перевіряти static export, а не Railway.**
   - Старий workflow з Railway не відповідав production-архітектурі BodyRes і міг падати незалежно від стану сайту.
   - Поточний workflow `.github/workflows/preview.yml` виконує `npm ci`, встановлює Chromium для Playwright і запускає `npm run ci`.

14. **Playwright-перевірка форми не має бити реальний `mail.php`.**
   - Тест перехоплює `mail.php` через `page.route`, перевіряє payload і success-state.
   - Це захищає форму від регресії без відправки тестових листів клієнту.

15. **FTP-деплой має брати тільки `out/`.**
   - `Elements/`, `.env*`, `.git`, `node_modules`, `.next` і `deploy-artifacts/` не є частиною production payload.
   - Якщо треба повторити деплой без Hostinger connector, використовуй `python scripts/deploy-static-ftp.py`; він завантажує зібраний static export у `public_html`.
   - Для поточного FTP-акаунта правильний remote dir: `domains/body-re.store/public_html`, а не голий `public_html`.

16. **Hostinger FTP може обірвати upload під час `STOR`.**
   - Симптом: `ConnectionResetError: [WinError 10054] An existing connection was forcibly closed by the remote host`.
   - Це може залишити `public_html` частково оновленим, тому не зупиняйся після такого падіння.
   - Поточний `scripts/deploy-static-ftp.py` має retry/reconnect на рівні файлу; після обриву повторюй команду або запускай її з більшим `--retries`.
   - Hostinger може залишити службовий файл `.in.<filename>.`; deploy script чистить обидва варіанти `.in.<filename>` і `.in.<filename>.`.
   - Щоб не провокувати повторний обрив на великому незмінному відео/зображенні, deploy script за замовчуванням пропускає media-файли, якщо remote size збігається з локальним. Якщо media реально змінився, але розмір випадково той самий, запускай з `--force-media`.
   - Деплой безпечний для повторного запуску: він перезаписує файли з `out/`, не видаляючи uploads або сторонні файли.

17. **Черга UI-правок і build — різні режими роботи.**
   - Якщо користувач просить “поставив у чергу” або “не роби збірку”, треба накопичити локальні правки і перевірити їх статично.
   - Не запускати `npm run ci` як “звичайний тест” у такому режимі, бо він через Playwright static server запускає static build.
   - Коли черга закінчена, тоді окремо запускати повну збірку, e2e і visual QA.

18. **Live `18084` не є доказом стану локальних файлів.**
   - `http://nlmhelp.keenetic.link:18084/` показує те, що зараз віддає NAS/container runtime.
   - Локальна правка `public/sharp-template/Sharp/index.html` не стане видимою там без відповідного build/runtime update.
   - Якщо користувач просить “не збирати”, не обіцяй видимість на `18084`; звітуй як “локально внесено, live оновиться після збірки/перезапуску”.

19. **Scoped verification важливіший за шумний глобальний lint.**
   - У цьому репо донорські папки містять старі/minified JS, які не мають визначати якість маленької runtime-правки.
   - Для поточної зміни перевіряй саме змінені файли: `npx eslint <changed test/js files>`, `git diff --check -- <changed files>`, mojibake scan.
   - Повний `npm run lint` має сенс тільки після окремого cleanup `eslint.config.mjs`, щоб виключити donor/source folders.

20. **Touch/mobile поведінка сервісних карток має бути явною.**
   - Desktop hover не працює як основний сценарій на мобільних і планшетах.
   - Якщо картка показує опис на hover, вона також має відкривати той самий опис на tap/click/keyboard без переходу на `#`.
   - Тест для цього сценарію живе в `tests/e2e/bodyres-smoke.spec.ts`.

## Деплой-підготовка

Перед наступним запуском перевір:

- чи немає в workflow неіснуючих action;
- чи задані всі потрібні secrets;
- чи не тягнеться в publish великий legacy binary з `Elements/`;
- чи збірка йде з того середовища, яке не ламається на UNC/root path;
- чи результат після build дійсно оновлює live URL, а не тільки GitHub run.
- чи немає окремого stale runtime, який віддає старий root iframe, навіть якщо шаблон на диску вже оновлений.
- чи потрібний target саме NAS preview `:18084`, а не Hostinger production `body-re.store`.

## Правила deploy, міграцій і комітів

### Static deploy на звичайний Hostinger

1. Production payload — тільки вміст `out/`.
2. Перед deploy обов’язково:
   - `npm install`;
   - `npm run ci`;
   - перевірка secret-scan без `.env.hostinger.local`;
   - перевірка `.deployignore`.
3. FTP-деплой виконується через `python scripts/deploy-static-ftp.py`.
4. Якщо Hostinger connector бачить домен, можна використовувати static website deploy з архівом `out/`; якщо connector не бачить домен, fallback — FTP.
5. Для поточного FTP-акаунта корінь сайту: `domains/body-re.store/public_html`.
6. Не деплоїти `node_modules`, `.next`, `.git`, `Elements`, `deploy-artifacts`, `.env*`.
7. Якщо треба максимально безпечний cutover для великої зміни:
   - завантажити `out/` у тимчасову теку поряд з `public_html`;
   - перевірити наявність `index.html`, `_next/`, `sharp-template/`;
   - переносити в `public_html` тільки після зеленої перевірки;
   - не видаляти старий `public_html`, доки нова версія не пройшла smoke test.
8. Для малих статичних правок допустимий прямий overwrite через FTP, але після нього обов’язковий smoke test production URL.

### Міграції

1. У production-режимі BodyRes зараз немає БД і серверних міграцій.
2. Якщо майбутній агент додає backend/API/БД, це вже не поточний `STATIC EXPORT` і потребує окремого архітектурного рішення.
3. Не додавати server-side маршрути або storage-залежності без явної зміни цільового хостингу.

### Коміти

1. Один коміт — одна логічна зміна.
2. Перед комітом:
   - `git status`;
   - path-limited `git diff`;
   - `npm run ci`;
   - secret-scan;
   - перевірити, що `.env.hostinger.local` і `deploy-artifacts/` ігноруються.
3. Не комітити:
   - `.env*`;
   - FTP/API secrets;
   - `out/`;
   - `deploy-artifacts/`;
   - `Elements/`;
   - `node_modules/`;
   - `.next/`.
4. Windows/Linux:
   - на Windows запускати з mapped drive (`X:\`) або локального шляху, не з UNC через `cmd.exe`;
   - на Linux/NAS запускати з реального шляху проєкту;
   - для env-перемінних не додавати shell-specific one-liner у `package.json`; використовувати Node/Python scripts.

## Пов’язані файли

- `README.md`
- `docs/architecture-decisions.md`
- `SPEC.md`
