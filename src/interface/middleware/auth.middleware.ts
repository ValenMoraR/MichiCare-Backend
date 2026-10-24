
import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    role: "admin" | "user";
  };
}

export function authenticateToken(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): void {
  const authorization = req.headers.authorization;

  // Comprobar que exista el encabezado Bearer.
  if (!authorization || !authorization.startsWith("Bearer ")) {
    res.status(401).json({
      mensaje: "Debes iniciar sesión para acceder a este recurso",
    });
    return;
  }

  const token = authorization.slice(7);
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    console.error("JWT_SECRET no está configurado");

    res.status(500).json({
      mensaje: "La autenticación no está configurada correctamente",
    });
    return;
  }

  try {
    const payload = jwt.verify(token, secret);

    if (
      typeof payload === "string" ||
      typeof payload.id !== "number" ||
      (payload.role !== "admin" && payload.role !== "user")
    ) {
      res.status(401).json({
        mensaje: "El token no es válido",
      });
      return;
    }

    // Guardar la identidad para los siguientes controladores.
    req.user = {
      id: payload.id,
      role: payload.role,
    };

    next();
  } catch {
    res.status(401).json({
      mensaje: "El token es inválido o ha expirado",
    });
  }
}
