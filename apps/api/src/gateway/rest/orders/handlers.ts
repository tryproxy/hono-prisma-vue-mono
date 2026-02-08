import { createOrderWorkflow } from "@/core/workflow/create-order-workflow";
import { getOrderByIdWorkflow } from "@/core/workflow/get-order-by-id-workflow";
import { listOrdersWorkflow } from "@/core/workflow/list-orders-workflow";
import { RouteHandler } from "@hono/zod-openapi";
import { createOrderRoute, getOrderByIdRoute, listOrdersRoute } from "./routes";

export const createOrderHandler: RouteHandler<typeof createOrderRoute> = async (
  ctx,
) => {
  const input = ctx.req.valid("json");
  const order = await createOrderWorkflow(input);
  return ctx.json({ ok: true, order }, 201);
};

export const listOrdersHandler: RouteHandler<typeof listOrdersRoute> = async (
  ctx,
) => {
  const orders = await listOrdersWorkflow();
  return ctx.json(orders, 200);
};

export const getOrderByIdHandler: RouteHandler<
  typeof getOrderByIdRoute
> = async (ctx) => {
  const param = ctx.req.valid("param");
  const order = await getOrderByIdWorkflow(param);

  if (!order) return ctx.json({ order: null }, 200);
  return ctx.json(order, 200);
};
