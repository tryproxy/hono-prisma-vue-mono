import { createRoute } from "@hono/zod-openapi";
import {
  ListOrdersResponseSchema,
  CreateOrderRequestSchema,
  CreateOrderResponseSchema,
  GetOrderParamsSchema,
  GetOrderResponseSchema,
} from "../../../core/models/schemas";
import { ENDPOINTS } from "../constants";
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
