
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../../infrastructure/database/prisma.js";

interface LoginUserInput {
  email: string;
  password: string;
}

export class LoginUser {
  async execute(input: LoginUserInput) {
    const email = input.email.trim().toLowerCase();
    const password = input.password;

    // Validar que se hayan enviado las credenciales.
    if (!email || !password) {
      throw new Error("El correo y la contraseña son obligatorios");
    }

    // Buscar al usuario por su correo.
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // No revelar si falló el correo o la contraseña.
    if (!user) {
      throw new Error("INVALID_CREDENTIALS");
    }

    // Comparar la contraseña recibida con el hash guardado.
    const passwordIsValid = await bcrypt.compare(
      password,
      user.passwordHash,
    );

    if (!passwordIsValid) {
      throw new Error("INVALID_CREDENTIALS");
    }

    // Comprobar que exista la clave secreta de JWT.
    const secret = process.env.JWT_SECRET;

    if (!secret || secret === "reemplaza_esto_por_una_clave_secreta_larga") {
      throw new Error("JWT_SECRET_NOT_CONFIGURED");
    }

    // Generar el token de autenticación.
    // Duración del token, leída de las variables de entorno.
    const expiresIn = (process.env.JWT_EXPIRES_IN ??
      "1d") as jwt.SignOptions["expiresIn"];

    // Generar el token de autenticación.
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
        secret,
        { expiresIn },
    );

    // Devolver el token y los datos públicos del usuario.
    return {
      token,
      usuario: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        role: user.role,
      },
    };
  }
}
