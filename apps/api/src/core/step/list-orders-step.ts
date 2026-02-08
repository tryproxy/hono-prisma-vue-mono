import { prisma } from "../../infrastructure/prisma/client";

export const listOrdersStep = async () =>
  await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
  });
