
import type { Request, Response } from "express";
import { DeleteProduct } from "../../application/use-cases/delete-product.use-case.js";

const deleteProduct = new DeleteProduct();

export async function deleteProductById(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id < 1) {
      res.status(400).json({
        mensaje: "El identificador del producto no es válido",
      });
      return;
    }

    const producto = await deleteProduct.execute(id);

    res.status(200).json({
      mensaje: "Producto eliminado correctamente",
      producto,
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "PRODUCT_NOT_FOUND") {
        res.status(404).json({
          mensaje: "No se encontró el producto solicitado",
        });
        return;
      }

      if (error.message === "INVALID_PRODUCT_ID") {
        res.status(400).json({
          mensaje: "El identificador del producto no es válido",
        });
        return;
      }
    }

    console.error("Error al eliminar el producto:", error);

    res.status(500).json({
      mensaje: "Ocurrió un error al eliminar el producto",
    });
  }
}
