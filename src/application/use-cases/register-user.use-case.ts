
import bcrypt from "bcrypt";
import { prisma } from "../../infrastructure/database/prisma.js";

interface RegisterUserInput {
  nombre: string;
  email: string;
  password: string;
}

export class RegisterUser {
  async execute(input: RegisterUserInput) {
    const nombre = input.nombre.trim();
    const email = input.email.trim().toLowerCase();
    const password = input.password;

    // Validar los datos básicos.
    if (!nombre || !email || !password) {
      throw new Error("Todos los campos son obligatorios");
    }

    if (password.length < 8) {
      throw new Error("La contraseña debe tener al menos 8 caracteres");
    }

    // Comprobar si el correo ya está registrado.
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error("EMAIL_ALREADY_EXISTS");
    }

    // Cifrar la contraseña antes de guardarla.
    const passwordHash = await bcrypt.hash(password, 12);

    // Crear el usuario en PostgreSQL.
    const user = await prisma.user.create({
      data: {
        nombre,
        email,
        passwordHash,
        role: "user",
      },
      select: {
        id: true,
        nombre: true,
        email: true,
        role: true,
      },
    });

    return user;
  }
}
