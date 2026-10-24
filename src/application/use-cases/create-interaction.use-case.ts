
import { prisma } from "../../infrastructure/database/prisma.js";

interface CreateInteractionInput {
  userId: number;
  nombreMichi: string;
  mensaje: string;
}

export class CreateInteraction {
  async execute(input: CreateInteractionInput) {
    const nombreMichi = input.nombreMichi.trim();
    const mensaje = input.mensaje.trim();

    if (nombreMichi.length < 1) {
      throw new Error("INVALID_CAT_NAME");
    }

    if (mensaje.length < 10) {
      throw new Error("INVALID_MESSAGE");
    }

    return prisma.interaction.create({
      data: {
        userId: input.userId,
        nombreMichi,
        mensaje,
      },
    });
  }
}
