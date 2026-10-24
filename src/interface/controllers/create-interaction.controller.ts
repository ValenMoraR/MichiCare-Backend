
import type { Response } from "express";
import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";
import { CreateInteraction } from "../../application/use-cases/create-interaction.use-case.js";

const createInteraction = new CreateInteraction();

export async function postInteraction(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    const { nombreMichi, mensaje } = req.body;

    if (
      typeof nombreMichi !== "string" ||
      typeof mensaje !== "string"
    ) {
      res.status(400).json({
        mensaje: "El nombre del michi y el mensaje son obligatorios",
      });
      return;
    }

    if (!req.user) {
      res.status(401).json({
        mensaje: "Debes iniciar sesión para enviar una solicitud",
      });
      return;
    }

    const interaction = await createInteraction.execute({
      userId: req.user.id,
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

    console.error("Error al registrar la interacción:", error);

    res.status(500).json({
      mensaje: "Ocurrió un error al registrar la solicitud",
    });
  }
}
