import { Hono } from "hono";
import { prisma } from "./db";

export const app = new Hono();

app.get("/api/hello", (c) => c.json({ ok: true, message: "hello from api" }));

app.get("/api/db-ping", async (c) => {
  const row = await prisma.ping.create({ data: {} });
  return c.json({ ok: true, ping: row });
});
