import { prisma } from "../../infrastructure/prisma/client";
import { RouteHandler } from "@hono/zod-openapi";
import {
  pingRoute,
  createOrderRoute,
  listOrdersRoute,
  getOrderByIdRoute,
  healthRoute,
} from "./routes";
import { createOrderWorkflow } from "../../core/workflow/create-order-workflow";

export const createOrderHandler: RouteHandler<typeof createOrderRoute> = async (
  ctx,
) => {
  const input = ctx.req.valid("json");
  const order = await createOrderWorkflow(input);

  return ctx.json({ ok: true, order }, 201);
};

// TODO create workflows and steps
export const listOrdersHandler: RouteHandler<typeof listOrdersRoute> = async (
  ctx,
) => {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
  });

  return ctx.json(
    {
      orders: orders.map((order) => ({
        ...order,
        createdAt: order.createdAt.toISOString(),
      })),
      count: orders.length,
    },
    200,
  );
};

export const getOrderByIdHandler: RouteHandler<
  typeof getOrderByIdRoute
> = async (ctx) => {
  const { id } = ctx.req.valid("param");
  const unique = await prisma.order.findUnique({ where: { id } });

  if (!unique) return ctx.json({ order: null }, 200);

  return ctx.json(
    { order: { ...unique, createdAt: unique.createdAt.toISOString() } },
    200,
  );
};

export const healthHandler: RouteHandler<typeof healthRoute> = async (ctx) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return ctx.json({ ok: true, db: "up" }, 200);
  } catch {
    return ctx.json({ ok: false, db: "down" }, 503);
  }
};

export const pingHandler: RouteHandler<typeof pingRoute> = (ctx) =>
  ctx.json({ ok: true, message: "pong" }, 200);
