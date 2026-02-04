import { Hono } from "hono";
import { cors } from "hono/cors";
import { prisma } from "./db";

export const app = new Hono();

app.use(
  "/api/*",
  cors({
    origin: [
      "https://hono-prisma-vue-mono.vercel.app",
      "http://localhost:5173",
    ],
  }),
);

app.get("/api/hello", (c) => c.json({ ok: true, message: "hello from api" }));

app.get("/api/db-ping", async (c) => {
  const row = await prisma.ping.create({ data: {} });
  return c.json({ ok: true, ping: row });
});

app.get("/api/orders", async (c) => {
  const order = await prisma.order.findFirst({
    orderBy: { createdAt: "desc" },
  });
  return c.json({ ok: true, order });
});
