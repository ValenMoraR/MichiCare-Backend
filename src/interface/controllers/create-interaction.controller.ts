import type { Response } from "express";
import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";
import { CreateInteraction } from "../../application/use-cases/create-interaction.use-case.js";

const createInteraction = new CreateInteraction();

export async function postInteraction(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    const { tipo, nombreMichi, mensaje, productId } = req.body;

    if (tipo !== "producto" && tipo !== "michi") {
      res.status(400).json({
        mensaje: "El tipo de consulta no es válido",
      });
      return;
    }

    if (typeof nombreMichi !== "string" || typeof mensaje !== "string") {
      res.status(400).json({
        mensaje: "El nombre del michi y el mensaje son obligatorios",
      });
      return;
    }

    if (tipo === "producto" && (!Number.isInteger(productId) || productId <= 0)) {
      res.status(400).json({
        mensaje: "Debes indicar el producto sobre el que consultas",
      });
      return;
    }

    if (!req.user) {
      res.status(401).json({
        mensaje: "Debes iniciar sesión para enviar una solicitud",
      });
      return;
    }

    // El usuario sale del token, nunca del body.
    const interaction = await createInteraction.execute({
      userId: req.user.id,
      tipo,
      productId: tipo === "producto" ? productId : undefined,
      nombreMichi,
      mensaje,
    });

    res.status(201).json({
      mensaje: "Solicitud de contacto registrada correctamente",
      data: interaction,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "INVALID_CAT_NAME") {
      res.status(400).json({
        mensaje: "El nombre del michi no puede estar vacío",
      });
      return;
    }

    if (error instanceof Error && error.message === "INVALID_MESSAGE") {
      res.status(400).json({
        mensaje: "El mensaje debe tener al menos 10 caracteres",
      });
      return;
    }

    if (error instanceof Error && error.message === "PRODUCT_REQUIRED") {
      res.status(400).json({
        mensaje: "Debes indicar el producto sobre el que consultas",
      });
      return;
    }

    if (error instanceof Error && error.message === "PRODUCT_NOT_FOUND") {
      res.status(404).json({
        mensaje: "El producto indicado no existe",
      });
      return;
    }

    console.error("Error al registrar la interacción:", error);

    res.status(500).json({
      mensaje: "Ocurrió un error al registrar la solicitud",
    });
  }
}