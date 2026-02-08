# apps/api

Backend API service for the project.
It exposes REST/OpenAPI endpoints, health checks, and Telegram bot integration used by the mini app.

## Run Locally

```bash
bun install
bun run dev
```

## Postgres (Docker)

```bash
docker run --name api-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=app \
  -p 5432:5432 \
  -d postgres:16
```

Example `DATABASE_URL`:

```bash
postgresql://postgres:postgres@localhost:5432/app
```
## Prisma Migrate (Local)

```bash
bunx prisma migrate dev --name init
bunx prisma generate
```

## Key Endpoints

- `GET /api/ping`
- `GET /api/health`
- `GET /api/orders`
- `POST /api/orders`
- `GET /api/order/{id}`
- `GET /api/docs`
- `GET /api/openapi.json`

## Deployment

- [Backend API](https://hono-prisma-vue-grammy.onrender.com)
- `API_BASE_URL` is used by the backend bot (`apps/api`).
