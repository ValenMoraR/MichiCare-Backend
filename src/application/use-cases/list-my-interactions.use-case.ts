
import { prisma } from "../../infrastructure/database/prisma.js";

export class ListMyInteractions {
  async execute(userId: number) {
    return prisma.interaction.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }
}
