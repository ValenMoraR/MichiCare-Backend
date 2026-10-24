
import type { Request, Response } from "express";
import { GetProductById } from "../../application/use-cases/get-product-by-id.use-case.js";

const getProductByIdUseCase = new GetProductById();

export async function getProductById(
  req: Request,
  res: Response
): Promise<void> {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id < 1) {
    res.status(400).json({
      mensaje: "El identificador del producto debe ser un entero positivo",
    });
    return;
  }

  try {
    const producto = await getProductByIdUseCase.execute(id);

    res.status(200).json({ producto });
  } catch (error) {
    if (error instanceof Error && error.message === "PRODUCT_NOT_FOUND") {
      res.status(404).json({ mensaje: "Producto no encontrado" });
      return;
    }

    console.error("Error al consultar el producto:", error);
    res.status(500).json({
      mensaje: "Ocurrió un error interno al consultar el producto",
    });
  }
}
