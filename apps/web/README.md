# apps/web

Telegram Mini App frontend (WebView client) for this project.  
It is optimized for in-Telegram mobile usage and consumes `apps/api` endpoints.

## Project Setup

```sh
bun install
```

### Compile and Hot-Reload for Development

```sh
bun dev
```

### Type-Check, Compile and Minify for Production

```sh
bun run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
bun lint
```

## Deployment

- [Mini app (frontend)](https://hono-prisma-vue-mono.vercel.app/)
- `VITE_API_BASE_URL` is used by the frontend (`apps/web`).
