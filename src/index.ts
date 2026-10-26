// Carga las variables del archivo .env antes que cualquier otro módulo.
import "dotenv/config";

import express, { type NextFunction, type Request, type Response } from "express";
import cors from "cors";
import healthRoutes from "./interface/routes/health.routes.js";
import authRoutes from "./interface/routes/auth.routes.js";
import productRoutes from "./interface/routes/product.routes.js";
import interactionRoutes from "./interface/routes/interaction.routes.js";

const app = express();

// Render y Railway asignan el puerto por variable de entorno.
const PORT = Number(process.env.PORT) || 3000;

// Orígenes autorizados para consumir la API (separa varios con coma).
const origenesPermitidos = (process.env.FRONTEND_URL ?? "http://localhost:3001")
  .split(",")
  .map((url) => url.trim())
  .filter(Boolean);

// Permite que el frontend en Vercel consuma la API, solo desde esos orígenes.
app.use(
  cors({
    origin: origenesPermitidos,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    mensaje: "¡Bienvenido a la API de MichiCare!",
    estado: "Servidor funcionando correctamente",
  });
});

app.use(healthRoutes);
app.use(authRoutes);
app.use(productRoutes);
app.use(interactionRoutes);

// Cualquier ruta que no exista responde 404 en JSON, sin HTML de Express.
app.use((_req: Request, res: Response) => {
  res.status(404).json({ mensaje: "La ruta solicitada no existe" });
});

// Manejador central de errores: nunca devuelve el stack trace al cliente.
app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Error no controlado:", error);
  res.status(500).json({ mensaje: "Ocurrió un error interno en el servidor" });
});

app.listen(PORT, () => {
  console.log(`Servidor de MichiCare escuchando en el puerto ${PORT}`);
});
