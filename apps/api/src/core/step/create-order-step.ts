import { prisma } from "../../infrastructure/prisma/client";
import { CreateOrderWorkflowInput } from "../models/types";

export const createOrderStep = async (input: CreateOrderWorkflowInput) =>
  await prisma.order.create({ data: input });
