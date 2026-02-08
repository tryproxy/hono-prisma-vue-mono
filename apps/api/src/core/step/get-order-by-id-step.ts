import { prisma } from "../../infrastructure/prisma/client";
import { GetOrderByIdInput } from "../models/types";

export const getOrderByIdStep = async (input: GetOrderByIdInput) =>
  await prisma.order.findUnique({ where: input });
