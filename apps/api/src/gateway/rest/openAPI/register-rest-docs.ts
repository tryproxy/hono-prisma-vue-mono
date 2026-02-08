import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono } from "@hono/zod-openapi";
import { ENDPOINTS } from "../constants";

export const registerRestDocs = (app: OpenAPIHono) => {
  app.doc(ENDPOINTS.openapi, {
    openapi: "3.0.0",
    info: {
      title: "API Documentation",
      version: "1.0.0",
      description: "API documentation for your service",
    },
  });

  app.use(ENDPOINTS.docs, swaggerUI({ url: ENDPOINTS.openapi }));
};
