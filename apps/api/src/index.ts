import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono } from "@hono/zod-openapi";
import { cors } from "hono/cors";
import { registerRestGateway } from "./gateway/rest";
import { ENDPOINTS } from "./gateway/rest/constants";

export const app = new OpenAPIHono();
registerRestGateway(app);

app.use(
  "/api/*",
  cors({
    origin: [
      "https://hono-prisma-vue-mono.vercel.app",
      "http://localhost:5173",
    ],
  }),
);

app.doc(ENDPOINTS.openapi, {
  openapi: "3.0.0",
  info: {
    title: "API Documentation",
    version: "1.0.0",
    description: "API documentation for your service",
  },
});

app.use(ENDPOINTS.docs, swaggerUI({ url: ENDPOINTS.openapi }));
