import { ListOrdersWorkflowResult } from "../models/types";
import { listOrdersStep } from "../step/list-orders-step";

export const listOrdersWorkflow =
  async (): Promise<ListOrdersWorkflowResult> => {
    const orders = await listOrdersStep();

    return {
      count: orders.length,
      orders: orders.map((order) => ({
        id: order.id,
        userId: order.userId,
        item: order.item,
        qty: order.qty,
        username: order.username,
        createdAt: order.createdAt.toDateString(),
      })),
    };
  };
