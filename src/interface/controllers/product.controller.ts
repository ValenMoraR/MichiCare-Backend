import type { Request, Response } from "express";
import { ListProducts } from "../../application/use-cases/list-products.use-case.js";

const listProducts = new ListProducts();

// Convierte un parámetro de precio: vacío o ausente = sin filtro.
function parsePrice(value: string | undefined): number | undefined {
  if (value === undefined || value.trim() === "") return undefined;
  return Number(value);
}

export async function getProducts(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const pageParam = req.query.page;
    const limitParam = req.query.limit;
    const categoriaParam = req.query.categoria;
    const qParam = req.query.q;
    const minParam = req.query.minPrecio;
    const maxParam = req.query.maxPrecio;

    // Validar que los parámetros sean valores simples.
    if (
      (pageParam !== undefined && typeof pageParam !== "string") ||
      (limitParam !== undefined && typeof limitParam !== "string") ||
      (categoriaParam !== undefined && typeof categoriaParam !== "string") ||
      (qParam !== undefined && typeof qParam !== "string") ||
      (minParam !== undefined && typeof minParam !== "string") ||
      (maxParam !== undefined && typeof maxParam !== "string")
    ) {
      res.status(400).json({
        mensaje: "Los parámetros de consulta no son válidos",
      });
      return;
    }

    const page = pageParam === undefined ? 1 : Number(pageParam);
    const limit = limitParam === undefined ? 10 : Number(limitParam);

    const result = await listProducts.execute({
      page,
      limit,
      categoria: categoriaParam,
      q: qParam,
      minPrecio: parsePrice(minParam),
      maxPrecio: parsePrice(maxParam),
    });

    res.status(200).json({
      pagination: {
        page: result.paginacion.pagina,
        limit: result.paginacion.limite,
        total: result.paginacion.total,
        totalPages: result.paginacion.totalPaginas,
      },
      data: result.productos,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "INVALID_PAGINATION") {
      res.status(400).json({
        mensaje:
          "La página debe ser mayor que 0 y el límite debe estar entre 1 y 100",
      });
      return;
    }

    if (error instanceof Error && error.message === "INVALID_FILTERS") {
      res.status(400).json({
        mensaje:
          "Los filtros no son válidos: el precio debe ser un número positivo y el mínimo no puede superar al máximo",
      });
      return;
    }

    console.error("Error al consultar los productos:", error);

    res.status(500).json({
      mensaje: "Ocurrió un error al consultar el catálogo",
    });
  }
}