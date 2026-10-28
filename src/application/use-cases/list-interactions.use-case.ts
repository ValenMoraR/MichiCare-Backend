import { prisma } from "../../infrastructure/database/prisma.js";

export class ListInteractions {
  async execute() {
    return prisma.interaction.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            id: true,
            nombre: true,
            email: true,
          },
        },
        product: {
          select: {
            id: true,
            nombre: true,
          },
        },
      },
    });
  }
}