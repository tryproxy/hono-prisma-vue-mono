import { RouteHandler } from "@hono/zod-openapi";
import { checkDbHealth } from "../../../lib/db";
import { healthRoute, pingRoute } from "./routes";

export const healthHandler: RouteHandler<typeof healthRoute> = async (ctx) => {
  const isUp = await checkDbHealth();
  return isUp
    ? ctx.json({ ok: true, db: "up" }, 200)
    : ctx.json({ ok: false, db: "down" }, 503);
};

export const pingHandler: RouteHandler<typeof pingRoute> = (ctx) =>
  ctx.json({ ok: true, message: "pong" }, 200);
