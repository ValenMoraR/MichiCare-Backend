
import { prisma } from "../../infrastructure/database/prisma.js";

export class DeleteProduct {
  async execute(id: number) {
    // Validar el identificador.
    if (!Number.isInteger(id) || id < 1) {
      throw new Error("INVALID_PRODUCT_ID");
    }

    // Comprobar que el producto exista.
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      throw new Error("PRODUCT_NOT_FOUND");
    }

    // Eliminar el producto de PostgreSQL.
    await prisma.product.delete({
      where: { id },
    });

    return {
      id: existingProduct.id,
      nombre: existingProduct.nombre,
    };
  }
}

