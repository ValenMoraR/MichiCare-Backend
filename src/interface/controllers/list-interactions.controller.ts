
import type { Request, Response } from "express";
import { ListInteractions } from "../../application/use-cases/list-interactions.use-case.js";

const listInteractions = new ListInteractions();

export async function getAllInteractions(
  _req: Request,
  res: Response
): Promise<void> {
  try {
    const interactions = await listInteractions.execute();

    res.status(200).json({
      total: interactions.length,
      data: interactions,
    });
  } catch (error) {
    console.error("Error al consultar todas las interacciones:", error);

    res.status(500).json({
      mensaje: "Ocurrió un error al consultar las solicitudes",
    });
  }
}
