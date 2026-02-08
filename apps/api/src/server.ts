import "./gateway/tg-bot";
import { app } from "./index";

const port = Number(process.env.PORT ?? 3000);

const host = process.env.HOST ?? "0.0.0.0";
console.log(`API running at http://${host}:${port}`);

Bun.serve({
  port,
  fetch: app.fetch,
});
