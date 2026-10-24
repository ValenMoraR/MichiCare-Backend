
import { prisma } from "../../infrastructure/database/prisma.js";

interface UpdateProductInput {
  id: number;
  nombre?: string;
  descripcion?: string;
  precio?: number;
  imagen?: string | null;
  categoria?: string;
}

export class UpdateProduct {
  async execute(input: UpdateProductInput) {
    const { id } = input;

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

    // Preparar únicamente los campos enviados.
    const data: {
      nombre?: string;
      descripcion?: string;
      precio?: number;
      imagen?: string | null;
      categoria?: string;
    } = {};

    if (input.nombre !== undefined) {
      if (!input.nombre.trim()) {
        throw new Error("INVALID_PRODUCT_FIELDS");
      }
      data.nombre = input.nombre.trim();
    }

    if (input.descripcion !== undefined) {
      if (!input.descripcion.trim()) {
        throw new Error("INVALID_PRODUCT_FIELDS");
      }
      data.descripcion = input.descripcion.trim();
    }

    if (input.categoria !== undefined) {
      if (!input.categoria.trim()) {
        throw new Error("INVALID_PRODUCT_FIELDS");
      }
      data.categoria = input.categoria.trim();
    }

    if (input.precio !== undefined) {
      if (
        typeof input.precio !== "number" ||
        !Number.isFinite(input.precio) ||
        input.precio <= 0
      ) {
        throw new Error("INVALID_PRODUCT_PRICE");
      }
      data.precio = input.precio;
    }

    if (input.imagen !== undefined) {
      if (input.imagen !== null && typeof input.imagen !== "string") {
        throw new Error("INVALID_PRODUCT_FIELDS");
      }
      data.imagen = input.imagen?.trim() || null;
    }

    // Guardar los cambios en PostgreSQL.
    return prisma.product.update({
      where: { id },
      data,
    });
  }
}
