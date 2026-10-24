
import type { Response, NextFunction } from "express";
import type { AuthenticatedRequest } from "./auth.middleware.js";

export function authorizeRoles(...allowedRoles: ("admin" | "user")[]) {
  return (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): void => {
    // Comprobar que el usuario esté autenticado.
    if (!req.user) {
      res.status(401).json({
        mensaje: "Debes iniciar sesión para acceder a este recurso",
      });
      return;
    }

    // Comprobar que su rol tenga permiso.
    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        mensaje: "No tienes permisos para realizar esta acción",
      });
      return;
    }

    next();
  };
}
