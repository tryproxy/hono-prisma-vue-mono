import { createRoute } from "@hono/zod-openapi";
import { ENDPOINTS } from "./config";
import {
  CreateOrderRequestSchema,
  CreateOrderResponseSchema,
  GetOrderParamsSchema,
  GetOrderResponseSchema,
  PingResponseSchema,
  ListOrdersResponseSchema,
  HealthResponseSchema,
} from "./schemas";

export const listOrdersRoute = createRoute({
  method: "get",
  path: ENDPOINTS.orders,
  summary: "All orders",
  responses: {
    200: {
      description: "Orders retrieved",
      content: {
        "application/json": {
          schema: ListOrdersResponseSchema,
        },
      },
    },
  },
});

export const createOrderRoute = createRoute({
  method: "post",
  path: ENDPOINTS.orders,
  summary: "Create order",
  request: {
    body: {
      content: {
        "application/json": {
          schema: CreateOrderRequestSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: "Order created",
      content: {
        "application/json": {
          schema: CreateOrderResponseSchema,
        },
      },
    },
  },
});

export const getOrderByIdRoute = createRoute({
  method: "get",
  path: ENDPOINTS.order,
  summary: "Get order by id",
  request: {
    params: GetOrderParamsSchema,
  },
  responses: {
    200: {
      description: "Order retrieved",
      content: {
        "application/json": {
          schema: GetOrderResponseSchema,
        },
      },
    },
  },
});

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
