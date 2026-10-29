import { prisma } from "../../infrastructure/database/prisma.js";

interface ListProductsInput {
  page?: number;
  limit?: number;
  categoria?: string;
  q?: string;
  minPrecio?: number;
  maxPrecio?: number;
}

export class ListProducts {
  async execute(input: ListProductsInput = {}) {
    const page = input.page ?? 1;
    const limit = input.limit ?? 10;
    const categoria = input.categoria?.trim();
    const q = input.q?.trim();
    const { minPrecio, maxPrecio } = input;

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

    // Validar los filtros de búsqueda y de precio.
    const invalidPrice = (value: number | undefined) =>
      value !== undefined && (!Number.isFinite(value) || value < 0);

    if (
      (q !== undefined && q.length > 100) ||
      invalidPrice(minPrecio) ||
      invalidPrice(maxPrecio) ||
      (minPrecio !== undefined && maxPrecio !== undefined && minPrecio > maxPrecio)
    ) {
      throw new Error("INVALID_FILTERS");
    }

    // Construir los filtros combinados: categoría, texto y rango de precio.
    const where = {
      ...(categoria
        ? {
            categoria: {
              equals: categoria,
              mode: "insensitive" as const,
            },
          }
        : {}),
      ...(q
        ? {
            OR: [
              { nombre: { contains: q, mode: "insensitive" as const } },
              { descripcion: { contains: q, mode: "insensitive" as const } },
            ],
          }
        : {}),
      ...(minPrecio !== undefined || maxPrecio !== undefined
        ? {
            precio: {
              ...(minPrecio !== undefined ? { gte: minPrecio } : {}),
              ...(maxPrecio !== undefined ? { lte: maxPrecio } : {}),
            },
          }
        : {}),
    };

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