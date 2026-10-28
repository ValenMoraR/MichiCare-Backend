import { prisma } from "../../infrastructure/database/prisma.js";

interface CreateProductInput {
  nombre: string;
  descripcion: string;
  precio: number;
  imagen?: string | null;
  categoria: string;
  stock?: number;
}

export class CreateProduct {
  async execute(input: CreateProductInput) {
    const nombre = input.nombre.trim();
    const descripcion = input.descripcion.trim();
    const categoria = input.categoria.trim();
    const imagen = input.imagen?.trim() || null;
    const stock = input.stock ?? 0;

    // Validar los datos obligatorios.
    if (!nombre || !descripcion || !categoria) {
      throw new Error("MISSING_PRODUCT_FIELDS");
    }

    // Validar el precio.
    if (
      typeof input.precio !== "number" ||
      !Number.isFinite(input.precio) ||
      input.precio <= 0
    ) {
      throw new Error("INVALID_PRODUCT_PRICE");
    }

    // Validar el stock: entero mayor o igual a cero.
    if (!Number.isInteger(stock) || stock < 0) {
      throw new Error("INVALID_PRODUCT_STOCK");
    }

    // Guardar el producto en PostgreSQL.
    return prisma.product.create({
      data: {
        nombre,
        descripcion,
        precio: input.precio,
        imagen,
        categoria,
        stock,
      },
    });
  }
}