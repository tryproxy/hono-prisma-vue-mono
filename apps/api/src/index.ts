import { OpenAPIHono } from "@hono/zod-openapi";
import { cors } from "hono/cors";
import { registerRestGateway } from "./gateway/rest";
import { registerRestDocs } from "./gateway/rest/openAPI/register-rest-docs";
import { registerHealthChecksInfrastructure } from "./infrastructure/prisma/register-health-checker";

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
