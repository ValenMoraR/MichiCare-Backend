
import type { Response } from "express";
import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";
import { ListMyInteractions } from "../../application/use-cases/list-my-interactions.use-case.js";

const listMyInteractions = new ListMyInteractions();

export async function getMyInteractions(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({
        mensaje: "Debes iniciar sesión para consultar tus solicitudes",
      });
      return;
    }

    const interactions = await listMyInteractions.execute(req.user.id);

    res.status(200).json({
      total: interactions.length,
      data: interactions,
    });
  } catch (error) {
    console.error("Error al consultar las solicitudes propias:", error);

    res.status(500).json({
      mensaje: "Ocurrió un error al consultar tus solicitudes",
    });
  }
}
