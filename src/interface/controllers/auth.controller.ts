
import type { Request, Response } from "express";
import { RegisterUser } from "../../application/use-cases/register-user.use-case.js";

const registerUser = new RegisterUser();

export async function register(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { nombre, email, password } = req.body;

    if (
      typeof nombre !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string"
    ) {
      res.status(400).json({
        mensaje: "Nombre, correo y contraseña son obligatorios",
      });
      return;
    }

    const user = await registerUser.execute({
      nombre,
      email,
      password,
    });

    res.status(201).json({
      mensaje: "Usuario registrado correctamente",
      usuario: user,
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "EMAIL_ALREADY_EXISTS") {
        res.status(409).json({
          mensaje: "El correo electrónico ya está registrado",
        });
        return;
      }

      if (
        error.message === "Todos los campos son obligatorios" ||
        error.message ===
          "La contraseña debe tener al menos 8 caracteres"
      ) {
        res.status(400).json({
          mensaje: error.message,
        });
        return;
      }
    }

    console.error("Error al registrar usuario:", error);

    res.status(500).json({
      mensaje: "Ocurrió un error interno al registrar el usuario",
    });
  }
}
