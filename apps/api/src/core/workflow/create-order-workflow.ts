import {
  CreateOrderWorkflowInput,
  CreateOrderWorkflowResult,
} from "../models/types";
import { createOrderStep } from "../step/create-order-step";

export const createOrderWorkflow = async (
  input: CreateOrderWorkflowInput,
): Promise<CreateOrderWorkflowResult> => {
  const order = await createOrderStep(input);

  return {
    id: order.id,
    userId: order.userId,
    item: order.item,
    qty: order.qty,
    username: order.username,
    createdAt: order.createdAt.toISOString(),
  };
};
