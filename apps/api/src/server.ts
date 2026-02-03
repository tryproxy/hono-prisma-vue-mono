import { app } from "./index";

const port = Number(process.env.PORT ?? 3000);

console.log(`API running at http://localhost:${port}`);

Bun.serve({
  port,
  fetch: app.fetch,
});
