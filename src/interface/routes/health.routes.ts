
import { Router } from "express";
import { prisma } from "../../infrastructure/database/prisma.js";

const router = Router();

// Comprueba que la API esté funcionando.
router.get("/health", (_req, res) => {
  res.status(200).json({
    estado: "ok",
    mensaje: "La API de MichiCare está funcionando",
  });
});

// Comprueba la conexión con PostgreSQL.
router.get("/health/database", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    res.status(200).json({
      estado: "ok",
      mensaje: "La conexión con la base de datos funciona",
    });
  } catch (error) {
    console.error("Error al conectar con PostgreSQL:", error);

    res.status(503).json({
      estado: "error",
      mensaje: "No fue posible conectar con la base de datos",
    });
  }
});

export default router;
