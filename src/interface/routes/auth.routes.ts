
import { Router } from "express";
import { register } from "../controllers/auth.controller.js";
import { login } from "../controllers/login.controller.js";
import {
  authenticateToken,
  type AuthenticatedRequest,
} from "../middleware/auth.middleware.js";

const router = Router();

// Registrar un usuario nuevo.
router.post("/api/auth/register", register);

// Iniciar sesión.
router.post("/api/auth/login", login);

// Consultar los datos del usuario autenticado.
router.get("/api/auth/me", authenticateToken, (req, res) => {
  const authenticatedReq = req as AuthenticatedRequest;

  res.status(200).json({
    mensaje: "Usuario autenticado correctamente",
    usuario: authenticatedReq.user,
  });
});

export default router;
