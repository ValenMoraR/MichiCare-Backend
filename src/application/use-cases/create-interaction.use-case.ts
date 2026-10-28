import { prisma } from "../../infrastructure/database/prisma.js";

export type InteractionTipo = "producto" | "michi";

interface CreateInteractionInput {
  userId: number;
  tipo: InteractionTipo;
  productId?: number;
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

    // Una consulta sobre un producto debe apuntar a un producto del catálogo.
    // Una consulta sobre el michi no lleva producto.
    let productId: number | null = null;

    if (input.tipo === "producto") {
      if (input.productId === undefined) {
        throw new Error("PRODUCT_REQUIRED");
      }

      const product = await prisma.product.findUnique({
        where: { id: input.productId },
      });

      if (!product) {
        throw new Error("PRODUCT_NOT_FOUND");
      }

      productId = product.id;
    }

    return prisma.interaction.create({
      data: {
        userId: input.userId,
        tipo: input.tipo,
        productId,
        nombreMichi,
        mensaje,
      },
      include: {
        product: { select: { id: true, nombre: true } },
      },
    });
  }
}