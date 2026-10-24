
import type { Request, Response } from "express";
import { LoginUser } from "../../application/use-cases/login-user.use-case.js";

const loginUser = new LoginUser();

export async function login(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { email, password } = req.body;

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password
    ) {
      res.status(400).json({
        mensaje: "El correo y la contraseña son obligatorios",
      });
      return;
    }

    const result = await loginUser.execute({
      email,
      password,
    });

    res.status(200).json({
      mensaje: "Inicio de sesión exitoso",
      ...result,
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "INVALID_CREDENTIALS") {
        res.status(401).json({
          mensaje: "Correo electrónico o contraseña incorrectos",
        });
        return;
      }

      if (
        error.message ===
        "El correo y la contraseña son obligatorios"
      ) {
        res.status(400).json({
          mensaje: error.message,
        });
        return;
      }

      if (error.message === "JWT_SECRET_NOT_CONFIGURED") {
        console.error("JWT_SECRET no está configurado correctamente");

        res.status(500).json({
          mensaje: "La autenticación no está configurada correctamente",
        });
        return;
      }
    }

    console.error("Error al iniciar sesión:", error);

    res.status(500).json({
      mensaje: "Ocurrió un error interno al iniciar sesión",
    });
  }
}
