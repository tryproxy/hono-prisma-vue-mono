import { OpenAPIHono } from "@hono/zod-openapi";
import {
  pingHandler,
  createOrderHandler,
  listOrdersHandler,
  getOrderByIdHandler,
  healthHandler,
} from "./handlers";
import {
  pingRoute,
  createOrderRoute,
  listOrdersRoute,
  getOrderByIdRoute,
  healthRoute,
} from "./routes";

export const registerRestGateway = (app: OpenAPIHono) => {
  app.openapi(pingRoute, pingHandler);
  app.openapi(createOrderRoute, createOrderHandler);
  app.openapi(listOrdersRoute, listOrdersHandler);
  app.openapi(getOrderByIdRoute, getOrderByIdHandler);
  app.openapi(healthRoute, healthHandler);
};
