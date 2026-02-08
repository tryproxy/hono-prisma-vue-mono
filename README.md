# hono-prisma-vue-bun

Monorepo for the Telegram mini-app stack:
- `apps/api`: Hono + Prisma backend API + Telegram bot integration
- `apps/web`: Vue frontend for Telegram WebView (mini app)
- `apps/local`: local WebSocket log receiver for development

Desktop web app lives in a separate repository:
- [chat-ai-frontend-vue](https://github.com/tryproxy/chat-ai-frontend-vue)

## Stack

- Runtime: Bun
- API: Hono, `@hono/zod-openapi`, Swagger UI
- DB: PostgreSQL + Prisma
- Bot: grammY
- Frontend: Vue 3 + Vite + TypeScript

## Repository Layout

| Path | Purpose |
| --- | --- |
| `apps/api` | Backend service, OpenAPI docs, Telegram bot |
| `apps/web` | Telegram mini-app frontend |
| `apps/local` | Local tooling (WebSocket receiver) |

## Prerequisites

- Bun `>=1.3`
- Docker (for local Postgres)

## Quick Start

1. Install dependencies.

```bash
bun install
```

2. Start local Postgres.

```bash
docker run --name api-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=app \
  -p 5432:5432 \
  -d postgres:16
```

3. Prepare API env file.

```bash
cp apps/api/.env.local.example apps/api/.env.local
```

4. Run Prisma migrations and generate client.

```bash
cd apps/api
bunx prisma migrate dev --name init
bunx prisma generate
```

5. Run services (in separate terminals).

```bash
# API
cd apps/api && bun run dev

# Web mini-app
cd apps/web && bun run dev

# Local WS log receiver (optional)
cd apps/local && bun run dev
```

## API Endpoints

| Method | Path |
| --- | --- |
| `GET` | `/api/ping` |
| `GET` | `/api/health` |
| `GET` | `/api/orders` |
| `POST` | `/api/orders` |
| `GET` | `/api/order/{id}` |
| `GET` | `/api/docs` |
| `GET` | `/api/openapi.json` |

- [Swagger UI](https://hono-prisma-vue-grammy.onrender.com/api/docs)


## Environment Files

- API example: `apps/api/.env.local.example`
- Web example: `apps/web/.env.local.example`

Set `VITE_API_BASE_URL` in web env to your backend URL (default: `http://localhost:3000`).

## Architecture Notes

Architecture direction is documented in `apps/api/ARCHITECTURE.md`:
- `core`
- `infrastructure`
- `gateway`
- `lib`


## Deployment

- [Backend](https://hono-prisma-vue-grammy.onrender.com)
- [Telegram Mini-App(frontend)](https://hono-prisma-vue-mono.vercel.app/)
- [Desktop Web App(frontend)](https://chat-ai-fronend-vue.vercel.app/)
