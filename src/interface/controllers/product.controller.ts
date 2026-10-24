
import type { Request, Response } from "express";
import { ListProducts } from "../../application/use-cases/list-products.use-case.js";

const listProducts = new ListProducts();

export async function getProducts(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const pageParam = req.query.page;
    const limitParam = req.query.limit;
    const categoriaParam = req.query.categoria;

    // Validar que los parámetros sean valores simples.
    if (
      (pageParam !== undefined && typeof pageParam !== "string") ||
      (limitParam !== undefined && typeof limitParam !== "string") ||
      (categoriaParam !== undefined &&
        typeof categoriaParam !== "string")
    ) {
      res.status(400).json({
        mensaje: "Los parámetros de consulta no son válidos",
      });
      return;
    }

    const page = pageParam === undefined
      ? 1
      : Number(pageParam);

    const limit = limitParam === undefined
      ? 10
      : Number(limitParam);

    const result = await listProducts.execute({
        page,
        limit,
        categoria: categoriaParam,
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
    if (
      error instanceof Error &&
      error.message === "INVALID_PAGINATION"
    ) {
      res.status(400).json({
        mensaje: "La página debe ser mayor que 0 y el límite debe estar entre 1 y 100",
      });
      return;
    }

    console.error("Error al consultar los productos:", error);

    res.status(500).json({
      mensaje: "Ocurrió un error al consultar el catálogo",
    });
  }
}
