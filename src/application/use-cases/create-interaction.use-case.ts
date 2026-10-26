import { prisma } from "../../infrastructure/database/prisma.js";

interface CreateInteractionInput {
  userId: number;
  productId: number;
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

    // El producto debe existir en el catálogo.
    const product = await prisma.product.findUnique({
      where: { id: input.productId },
    });

    if (!product) {
      throw new Error("PRODUCT_NOT_FOUND");
    }

    return prisma.interaction.create({
      data: {
        userId: input.userId,
        productId: input.productId,
        nombreMichi,
        mensaje,
      },
      include: {
        product: { select: { id: true, nombre: true } },
      },
    });
  }
}