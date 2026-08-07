# BodyRes — Дизайн 1 (SPA-мінімалізм)

## Режим Next.js

Для BodyRes цільовий режим розгортання - `STATIC EXPORT`.

- Це означає готові `HTML/CSS/JS` файли без окремого `Node.js` сервера.
- Для публічного хостингу не використовуємо `SSR / API`, якщо немає окремої технічної причини.
- Якщо хостинг не вимагає серверної логіки, обираємо саме статичну збірку, щоб не переплачувати за інфраструктуру.
- Docker-режим у цьому проєкті лишається лише як технічний preview/deploy шлях для поточного середовища, а не як цільова продакшен-архітектура.

## Статус виконання

### ✅ Зроблено:
- 6 компонентів: Hero, Services, Benefits, Testimonials, CTA, Contacts
- SPA-кольори: mint #A8D5BA, powder #F5E6E0, terracotta #D4A574
- Шрифти: Cormorant Garamond, Nunito Sans, Playfair Display
- Next.js build працює
- Dockerfile + docker-compose.yml створені
- GitHub repo: https://github.com/vaoferi/bodyres (гілка design-1)
- Vaultwarden: збережено креденшали роутера

### ❌ Потрібна допомога:
1. **GitHub push** — HTTP 408 (мережева проблема)
2. **Docker** — потрібен sudo або пароль від роутера 192.168.2.1
3. **SSH до NAS** — пароль невідомий

## Креденшали

### Vaultwarden
- Host: nlmhelp.keenetic.link:18088
- Email: vaoferi@gmail.com
- Password: не зберігати в git; використовувати `.env.hostinger.local` або Vaultwarden

### Роутер Keenetic
- Local IP: 192.168.2.1
- Admin URL: http://192.168.2.1
- DDNS: vaoferi.keenetic.pro
- SSH: port 2222
- Пароль: **невідомо**

### Synology NAS
- IP: 10.0.1.12
- SSH: port 2222 (через роутер)
- Порти: 80, 443, 5000, 5001, 8920

## Для запуску контейнера

> Цей шлях потрібен для поточного preview/живого перегляду. Для фінального публічного розгортання пріоритет має `STATIC EXPORT`.

### Варіант 1: Docker на цьому ПК
```bash
sudo apt install docker.io docker-compose
cd /mnt/synology/BodyRes
docker-compose up -d
```

### Варіант 2: Відкрити порт на роутері
1. Зайти на http://192.168.2.1
2. Відкрити порт 3000 на зовнішню мережу
3. Потім запустити контейнер

### Варіант 3: Хмарний деплой
```bash
# Railway
railway login && railway init && railway up

# Render
render deploy

# Fly.io
fly launch && fly deploy
```

## Файли проекту
- `/mnt/synology/BodyRes/src/components/` — компоненти
- `/mnt/synology/BodyRes/Dockerfile` — Docker образ
- `/mnt/synology/BodyRes/docker-compose.yml` — Docker Compose
- `/mnt/synology/BodyRes/deploy.sh` — скрипт деплою
