
import express from "express";
import healthRoutes from "./interface/routes/health.routes.js";

const app = express();
const PORT = 3000;

// Permite que el servidor interprete solicitudes con datos JSON.
app.use(express.json());

// Ruta inicial de la API.
app.get("/", (_req, res) => {
  res.json({
    mensaje: "¡Bienvenido a la API de MichiCare!",
    estado: "Servidor funcionando correctamente",
  });
});

// Registra las rutas de comprobación.
app.use(healthRoutes);

// Inicia el servidor.
app.listen(PORT, () => {
  console.log(`Servidor de MichiCare escuchando en http://localhost:${PORT}`);
});
