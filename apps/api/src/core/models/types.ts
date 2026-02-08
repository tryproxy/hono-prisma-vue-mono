import z from "zod";
import {
  CreateOrderRequestSchema,
  GetOrderParamsSchema,
  GetOrderResponseSchema,
  ListOrdersResponseSchema,
  OrderSchema,
} from "./schemas";

export type CreateOrderWorkflowInput = z.infer<typeof CreateOrderRequestSchema>;
export type CreateOrderWorkflowResult = z.infer<typeof OrderSchema>;

export type ListOrdersWorkflowResult = z.infer<typeof ListOrdersResponseSchema>;

export type GetOrderByIdInput = z.infer<typeof GetOrderParamsSchema>;
export type GetOrderByIdResult = z.infer<typeof GetOrderResponseSchema>;
