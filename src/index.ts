
import express from "express";

const app = express();
const PORT = 3000;

// Permite que el servidor interprete solicitudes con datos JSON.
app.use(express.json());

// Ruta inicial para comprobar que el servidor funciona.
app.get("/", (_req, res) => {
  res.json({
    mensaje: "¡Bienvenido a la API de MichiCare!",
    estado: "Servidor funcionando correctamente",
  });
});

// Inicia el servidor.
app.listen(PORT, () => {
  console.log(`Servidor de MichiCare escuchando en http://localhost:${PORT}`);
});
