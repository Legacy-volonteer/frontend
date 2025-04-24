# Проект «Волонтёрка» — пошаговый гайд по запуску сайта.

> Фронтенд для учёта бонусов волонтёров. Реализация на **Nuxt + Nuxt UI kit**

---

## 1. Клонирование и установка

```bash
git clone https://github.com/Legacy-volonteer/frontend.git
cd frontend

# установка зависимостей
npm install

# создаём локальную копию переменных окружения
cp .env.example .env
```

---

## 2. Настройка окружения

Откройте файл **.env** и задайте url бэкенда:

```dotenv
API_URL=http://localhost:6969
```

---

## Сервер для разработки

Запустите сервер разработки по url `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm run dev

# yarn
yarn dev

# bun
bun run dev
```

## Продакшен

Соберите приложение для выпуска в продакшен:

```bash
# npm
npm run build

# pnpm
pnpm run build

# yarn
yarn build

# bun
bun run build
```

Локальный просмотр продакшен билда:

```bash
# npm
npm run preview

# pnpm
pnpm run preview

# yarn
yarn preview

# bun
bun run preview
```

© 2025 — Legacy Team
