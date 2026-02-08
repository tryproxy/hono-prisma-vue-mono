import { OpenAPIHono } from "@hono/zod-openapi";
import {
  createOrderHandler,
  getOrderByIdHandler,
  listOrdersHandler,
} from "./orders/handlers";

import {
  createOrderRoute,
  getOrderByIdRoute,
  listOrdersRoute,
} from "./orders/routes";
import { healthHandler, pingHandler } from "./system/handlers";
import { healthRoute, pingRoute } from "./system/routes";

export const registerRestGateway = (app: OpenAPIHono) => {
  app.openapi(pingRoute, pingHandler);
  app.openapi(healthRoute, healthHandler);

  app.openapi(createOrderRoute, createOrderHandler);
  app.openapi(listOrdersRoute, listOrdersHandler);
  app.openapi(getOrderByIdRoute, getOrderByIdHandler);
};
