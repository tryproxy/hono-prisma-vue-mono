import z from "zod";
import { CreateOrderRequestSchema, OrderSchema } from "./schemas";

export type CreateOrderWorkflowInput = z.infer<typeof CreateOrderRequestSchema>;
export type CreateOrderWorkflowResult = z.infer<typeof OrderSchema>;
