import type { Request, Response } from "express";
import { UpdateProduct } from "../../application/use-cases/update-product.use-case.js";

const updateProduct = new UpdateProduct();

export async function putProduct(
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

    const { nombre, descripcion, precio, imagen, categoria, stock } = req.body;

    // Comprobar que se haya enviado al menos un campo.
    if (
      nombre === undefined &&
      descripcion === undefined &&
      precio === undefined &&
      imagen === undefined &&
      categoria === undefined &&
      stock === undefined
    ) {
      res.status(400).json({
        mensaje: "Debes enviar al menos un campo para actualizar",
      });
      return;
    }

    // Validar los tipos de los campos recibidos.
    if (
      (nombre !== undefined && typeof nombre !== "string") ||
      (descripcion !== undefined && typeof descripcion !== "string") ||
      (categoria !== undefined && typeof categoria !== "string") ||
      (precio !== undefined && typeof precio !== "number") ||
      (stock !== undefined && typeof stock !== "number") ||
      (imagen !== undefined &&
        imagen !== null &&
        typeof imagen !== "string")
    ) {
      res.status(400).json({
        mensaje: "Uno o más campos tienen un formato inválido",
      });
      return;
    }

    const producto = await updateProduct.execute({
      id,
      nombre,
      descripcion,
      precio,
      imagen,
      categoria,
      stock,
    });

    res.status(200).json({
      mensaje: "Producto actualizado correctamente",
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

      if (error.message === "INVALID_PRODUCT_PRICE") {
        res.status(400).json({
          mensaje: "El precio debe ser un número mayor que cero",
        });
        return;
      }

      if (error.message === "INVALID_PRODUCT_STOCK") {
        res.status(400).json({
          mensaje: "El stock debe ser un número entero mayor o igual a cero",
        });
        return;
      }

      if (
        error.message === "INVALID_PRODUCT_ID" ||
        error.message === "INVALID_PRODUCT_FIELDS"
      ) {
        res.status(400).json({
          mensaje: "El identificador o los datos del producto no son válidos",
        });
        return;
      }
    }

    console.error("Error al actualizar el producto:", error);

    res.status(500).json({
      mensaje: "Ocurrió un error al actualizar el producto",
    });
  }
}