import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono } from "@hono/zod-openapi";
import { cors } from "hono/cors";
import { registerRestGateway } from "./gateway/rest";
import { ENDPOINTS } from "./gateway/rest/constants";
import { registerHealthChecksInfrastructure } from "./infrastructure/prisma/register-health-checker";
import { registerRestDocs } from "./gateway/rest/openAPI/register-rest-docs";

export const app = new OpenAPIHono();
registerHealthChecksInfrastructure();
registerRestGateway(app);
registerRestDocs(app);

app.use(
  "/api/*",
  cors({
    origin: [
      "https://hono-prisma-vue-mono.vercel.app",
      "http://localhost:5173",
    ],
  }),
);
