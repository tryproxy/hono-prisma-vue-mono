import { z } from "@hono/zod-openapi";

export const HealthResponseSchema = z.object({
  ok: z.boolean(),
  db: z.enum(["up", "down"]),
});

export const PingResponseSchema = z.object({
  ok: z.boolean(),
  message: z.string(),
});

// ORDER
export const OrderSchema = z.object({
  id: z.string(),
  createdAt: z.iso.datetime(),
  userId: z.string(),
  username: z.string().optional().nullable(),
  item: z.string(),
  qty: z.number().int().min(1),
});

export const GetOrderParamsSchema = z.object({
  id: z.string(),
});

export const GetOrderResponseSchema = z.object({
  order: z.nullable(OrderSchema),
});

// CREATE ORDER
export const CreateOrderResponseSchema = z.object({
  ok: z.boolean(),
  order: z.nullable(OrderSchema),
});

export const CreateOrderRequestSchema = z.object({
  userId: z.string(),
  username: z.string().nullable().optional(),
  item: z.string(),
  qty: z.number().int().min(1),
});

// GET ALL
export const ListOrdersResponseSchema = z.object({
  orders: z.array(OrderSchema),
  count: z.number().int().min(0),
});
