import {
  HealthResponseSchema,
  PingResponseSchema,
} from "@/core/models/schemas";
import { createRoute } from "@hono/zod-openapi";
import { ENDPOINTS } from "../constants";

export const pingRoute = createRoute({
  method: "get",
  path: ENDPOINTS.ping,
  summary: "Ping",
  responses: {
    200: {
      description: "Ping response",
      content: {
        "application/json": {
          schema: PingResponseSchema,
        },
      },
    },
  },
});

export const healthRoute = createRoute({
  method: "get",
  path: ENDPOINTS.health,
  summary: "Health check",
  responses: {
    200: {
      description: "Health check response",
      content: {
        "application/json": {
          schema: HealthResponseSchema,
        },
      },
    },
    503: {
      description: "Service unavailable",
      content: {
        "application/json": {
          schema: HealthResponseSchema,
        },
      },
    },
  },
});
