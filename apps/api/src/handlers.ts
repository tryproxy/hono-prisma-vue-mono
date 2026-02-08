import { prisma } from "./db";
import { RouteHandler } from "@hono/zod-openapi";
import {
  createOrderRoute,
  getOrderByIdRoute,
  healthRoute,
  listOrdersRoute,
  pingRoute,
} from "./routes";

export const pingHandler: RouteHandler<typeof pingRoute> = (ctx) =>
  ctx.json({ ok: true, message: "pong" }, 200);

export const createOrderHandler: RouteHandler<typeof createOrderRoute> = async (
  ctx,
) => {
  const { userId, username, item, qty } = ctx.req.valid("json");

  const created = await prisma.order.create({
    data: { userId, username, item, qty },
  });

  return ctx.json(
    {
      ok: true,
      order: { ...created, createdAt: created.createdAt.toISOString() },
    },
    201,
  );
};

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
