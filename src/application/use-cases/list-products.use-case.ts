
import { prisma } from "../../infrastructure/database/prisma.js";

interface ListProductsInput {
  page?: number;
  limit?: number;
  categoria?: string;
}

export class ListProducts {
  async execute(input: ListProductsInput = {}) {
    const page = input.page ?? 1;
    const limit = input.limit ?? 10;
    const categoria = input.categoria?.trim();

    // Validar los parámetros de paginación.
    if (
      !Number.isInteger(page) ||
      !Number.isInteger(limit) ||
      page < 1 ||
      limit < 1 ||
      limit > 100
    ) {
      throw new Error("INVALID_PAGINATION");
    }

    // Construir el filtro de categoría si se especifica.
    const where = categoria
      ? {
          categoria: {
            equals: categoria,
            mode: "insensitive" as const,
          },
        }
      : {};

    // Consultar los productos y el total de resultados.
    const [productos, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy: { id: "asc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    return {
      productos,
      paginacion: {
        pagina: page,
        limite: limit,
        total,
        totalPaginas: Math.ceil(total / limit),
      },
    };
  }
}
