# BodyRes project log

## 2026-08-09 — mobile CTA fix and Hostinger production deploy

- **Користувацький результат:** mobile review CTA тепер складається вертикально; текст і кнопка не стискаються в один ряд.
- **Причина інциденту:** `.review-google-cta` був визначений тільки в `max-width: 320px`, тому viewport 372px отримував `flex-direction: row`.
- **Зміна:** правило перенесено в `max-width: 767px`; додано cache-buster `responsive.css?v=20260809-1` та iframe `v=20260809-1`; додано mobile Playwright regression.
- **Перевірки:** `npm run build:static` (buildId `5cb0ccfbf1140604e6cdd2c09a48d4740221ab6ccb3cc16138d84a3ae83c1e57`), scoped ESLint для `src/app/page.tsx`, mobile Playwright test `1 passed`.
- **Deploy:** `python scripts/deploy-static-ftp.py --dry-run` — 230 файлів; реальний upload — 230 файлів / 30,963,249 bytes.
- **Важлива deploy-знахідка:** FTP login стартує в `/public_html`, але live vhost лежить у `/domains/body-re.store/public_html`. Шлях без початкового `/` давав `550 No such file or directory` або оновлював не той root. Конфіг і приклад виправлено на абсолютний `HOSTINGER_FTP_REMOTE_DIR=/domains/body-re.store/public_html`.
- **Cache:** у hPanel виконано `Очистити кеш`; підтверджено success notification `Кеш успішно очищено!`.
- **Production browser evidence (viewport 372x912):** root iframe `v=20260809-1`; responsive stylesheet `v=20260809-1`; CTA `flexDirection=column`; children occupy separate vertical rows; horizontal overflow `0`; video source `how-to-get-there-2.mp4`; contact address rendered as `Івана Фунтового 68/1, Одеса`; fresh root console had no warnings/errors.
- **Обмеження:** screenshot capture у browser backend двічі завершився timeout, тому фінальний visual evidence зафіксовано через live DOM/computed-style/geometry; це не маскується як screenshot PASS.
