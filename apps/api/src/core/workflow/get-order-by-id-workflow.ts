import { GetOrderByIdInput, GetOrderByIdResult } from "../models/types";
import { getOrderByIdStep } from "../step/get-order-by-id-step";

export const getOrderByIdWorkflow = async (
  input: GetOrderByIdInput,
): Promise<GetOrderByIdResult | null> => {
  const order = await getOrderByIdStep(input);
  if (!order) return null;
  return {
    order: {
      id: order.id,
      item: order.item,
      userId: order.userId,
      qty: order.qty,
      username: order.username,
      createdAt: order.createdAt.toDateString(),
    },
  };
};
