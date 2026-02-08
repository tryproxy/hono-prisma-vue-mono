import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono } from "@hono/zod-openapi";
import { cors } from "hono/cors";
import { ENDPOINTS } from "./config";
import {
  createOrderHandler,
  getOrderByIdHandler,
  healthHandler,
  listOrdersHandler,
  pingHandler,
} from "./handlers";
import {
  createOrderRoute,
  getOrderByIdRoute,
  healthRoute,
  listOrdersRoute,
  pingRoute,
} from "./routes";

export const app = new OpenAPIHono();

app.use(
  "/api/*",
  cors({
    origin: [
      "https://hono-prisma-vue-mono.vercel.app",
      "http://localhost:5173",
    ],
  }),
);

app.openapi(pingRoute, pingHandler);
app.openapi(createOrderRoute, createOrderHandler);
app.openapi(listOrdersRoute, listOrdersHandler);
app.openapi(getOrderByIdRoute, getOrderByIdHandler);
app.openapi(healthRoute, healthHandler);

app.doc(ENDPOINTS.openapi, {
  openapi: "3.0.0",
  info: {
    title: "API Documentation",
    version: "1.0.0",
    description: "API documentation for your service",
  },
});

app.use(ENDPOINTS.docs, swaggerUI({ url: ENDPOINTS.openapi }));
