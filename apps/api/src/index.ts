import { Hono } from "hono";
import { cors } from "hono/cors";
import { swaggerUI } from "@hono/swagger-ui";
import { prisma } from "./db";
import { ENDPOINTS } from "./config";

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

const openApiDoc = {
  openapi: "3.0.0",
  info: {
    title: "API Documentation",
    version: "1.0.0",
    description: "API documentation for your service",
  },
  paths: {
    [ENDPOINTS.hello]: {
      get: {
        summary: "Hello",
        responses: {
          "200": {
            description: "OK",
          },
        },
      },
    },
    [ENDPOINTS.dbPing]: {
      get: {
        summary: "Ping",
        responses: {
          "200": {
            description: "OK",
          },
        },
      },
    },
    [ENDPOINTS.orders]: {
      get: {
        summary: "Orders",
        responses: {
          "200": {
            description: "OK",
          },
        },
      },
    },
  },
};

app.get(ENDPOINTS.openapi, (ctx) => ctx.json(openApiDoc));
app.use(ENDPOINTS.docs, swaggerUI({ url: ENDPOINTS.openapi }));

app.get(ENDPOINTS.hello, (c) =>
  c.json({ ok: true, message: "hello from api" }),
);

app.get(ENDPOINTS.dbPing, async (c) => {
  const row = await prisma.ping.create({ data: {} });
  return c.json({ ok: true, ping: row });
});

app.get(ENDPOINTS.orders, async (c) => {
  const order = await prisma.order.findFirst({
    orderBy: { createdAt: "desc" },
  });
  return c.json({ ok: true, order });
});
