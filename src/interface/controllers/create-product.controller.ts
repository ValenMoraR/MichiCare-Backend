import type { Request, Response } from "express";
import { CreateProduct } from "../../application/use-cases/create-product.use-case.js";

const createProduct = new CreateProduct();

export async function postProduct(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { nombre, descripcion, precio, imagen, categoria, stock } = req.body;

    // Validar los campos de texto.
    if (
      typeof nombre !== "string" ||
      typeof descripcion !== "string" ||
      typeof categoria !== "string"
    ) {
      res.status(400).json({
        mensaje: "Nombre, descripción y categoría son obligatorios",
      });
      return;
    }

    // Validar el precio, el stock y la imagen.
    if (
      typeof precio !== "number" ||
      (stock !== undefined && typeof stock !== "number") ||
      (imagen !== undefined &&
        imagen !== null &&
        typeof imagen !== "string")
    ) {
      res.status(400).json({
        mensaje: "El precio, el stock o la imagen no tienen un formato válido",
      });
      return;
    }

    const producto = await createProduct.execute({
      nombre,
      descripcion,
      precio,
      imagen,
      categoria,
      stock,
    });

    res.status(201).json({
      mensaje: "Producto creado correctamente",
      producto,
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "MISSING_PRODUCT_FIELDS") {
        res.status(400).json({
          mensaje: "Nombre, descripción y categoría son obligatorios",
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
    }

    console.error("Error al crear el producto:", error);

    res.status(500).json({
      mensaje: "Ocurrió un error al crear el producto",
    });
  }
}