import { registerDbHealthChecker } from "../../lib/db";
import { prisma } from "./client";

export const registerHealthChecksInfrastructure = (): void => {
  registerDbHealthChecker(async () => {
    try {
      await prisma.$queryRaw`SELECT 1`;
      return true;
    } catch {
      return false;
    }
  });
};
