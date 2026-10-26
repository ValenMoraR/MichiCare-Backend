
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.js";
import bcrypt from "bcrypt";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("Falta configurar DATABASE_URL en el archivo .env");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const productos = [
  {
    id: 1,
    nombre: "Arena aglomerante para gatos",
    descripcion:
      "Arena que forma bloques compactos al contacto con la humedad, controla los olores y facilita la limpieza diaria del arenero.",
    precio: 38000,
    imagen: "../images/arena.png",
    categoria: "higiene",
    
  },
  {
    id: 2,
    nombre: "Fuente de agua eléctrica",
    descripcion:
      "Fuente con agua en movimiento y filtro, pensada para que tu michi tome más agua y se mantenga hidratado.",
    precio: 89000,
    imagen: "../images/fuente-agua.png",
    categoria: "alimentacion",
  },
  {
    id: 3,
    nombre: "Dispensador de comida automático",
    descripcion:
      "Entrega porciones de alimento a la hora que programes, ideal para mantener los horarios de comida de tu gato.",
    precio: 135000,
    imagen: "../images/dispensador-comida.png",
    categoria: "alimentacion",
  },
  {
    id: 4,
    nombre: "Cepillo removedor de pelo",
    descripcion:
      "Cepillo suave que retira el pelo suelto, reduce las bolas de pelo y deja su pelaje brillante.",
    precio: 22000,
    imagen: "../images/cepillo-pelo.png",
    categoria: "higiene",
  },
  {
    id: 5,
    nombre: "Alimento premium para gatitos",
    descripcion:
      "Alimento rico en proteína y nutrientes para acompañar el crecimiento sano de los gatitos. Bolsa de 3 kg.",
    precio: 78000,
    imagen: "../images/comida-premium-gatitos.png",
    categoria: "alimentacion",
  },
  {
    id: 6,
    nombre: "Alimento premium para gatos castrados",
    descripcion:
      "Fórmula balanceada que ayuda a controlar el peso y cuidar la salud urinaria de los gatos castrados. Bolsa de 3 kg.",
    precio: 82000,
    imagen: "../images/comida-premium-castrados.png",
    categoria: "alimentacion",
  },
  {
    id: 7,
    nombre: "Alimento premium para gatos adultos",
    descripcion:
      "Alimento completo para gatos adultos, con proteínas de calidad para mantener su energía y su pelaje. Bolsa de 3 kg.",
    precio: 76000,
    imagen: "../images/comida-premium.png",
    categoria: "alimentacion",
  },
  {
    id: 8,
    nombre: "Churus, premio cremoso",
    descripcion:
      "Snack cremoso que a los gatos les encanta; perfecto como premio o para fortalecer el vínculo con tu michi. Paquete de 4 sobres.",
    precio: 14000,
    imagen: "../images/churus.png",
    categoria: "alimentacion",
  },
  {
    id: 9,
    nombre: "Arenero automático",
    descripcion:
      "Limpia solo los desechos después de cada uso, para que el arenero esté siempre listo y sin olores.",
    precio: 480000,
    imagen: "../images/arenero-automatico.png",
    categoria: "higiene",
  },
  {
    id: 10,
    nombre: "Gimnasio para gatos",
    descripcion:
      "Torre con plataformas, rascadores y refugios para que tu michi juegue, trepe y descanse.",
    precio: 260000,
    imagen: "../images/gimnasio.png",
    categoria: "descanso",
  },
  {
    id: 11,
    nombre: "Set de ratones de tela",
    descripcion:
      "Ratoncitos suaves para perseguir, morder y lanzar, ideales para el juego y el ejercicio diario.",
    precio: 15000,
    imagen: "../images/ratones-tela.png",
    categoria: "juguetes",
  },
  {
    id: 12,
    nombre: "Rascador de cartón",
    descripcion:
      "Rascador reversible que cuida tus muebles y le da a tu gato un lugar para afilar las uñas y estirarse.",
    precio: 35000,
    imagen: "../images/rascador-de-carton.png",
    categoria: "juguetes",
  },
];

const usuarios = [
  {
    nombre: "Admin MichiCare",
    email: "admin@michicare.com",
    password: "Admin12345",
    role: "admin" as const,
  },
  {
    nombre: "Usuario de Prueba",
    email: "user@michicare.com",
    password: "User12345",
    role: "user" as const,
  },
];

// Unidades disponibles de cada producto (por id).
const stockPorProducto: Record<number, number> = {
  1: 25,
  2: 10,
  3: 8,
  4: 30,
  5: 20,
  6: 20,
  7: 20,
  8: 40,
  9: 5,
  10: 6,
  11: 35,
  12: 15,
};

async function main() {

  for (const producto of productos) {
    const stock = stockPorProducto[producto.id] ?? 0;

    await prisma.product.upsert({
      where: { id: producto.id },
      update: {
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        precio: producto.precio,
        imagen: producto.imagen,
        categoria: producto.categoria,
        stock,
      },
      create: { ...producto, stock },
    });
  }

  console.log(`Se cargaron ${productos.length} productos de MichiCare.`);

  // Como los productos se cargaron con id fijo, hay que avanzar el contador
  // para que los productos creados después desde /admin no choquen con ellos.
  await prisma.$executeRawUnsafe(
    `SELECT setval(pg_get_serial_sequence('products', 'id'), (SELECT MAX(id) FROM products))`,
  );

  for (const usuario of usuarios) {
    const passwordHash = await bcrypt.hash(usuario.password, 12);

    await prisma.user.upsert({
      where: { email: usuario.email },
      update: {
        nombre: usuario.nombre,
        passwordHash,
        role: usuario.role,
      },
      create: {
        nombre: usuario.nombre,
        email: usuario.email,
        passwordHash,
        role: usuario.role,
      },
    });
  }

  console.log(`Se cargaron ${usuarios.length} usuarios de prueba.`);
}

main()
  .catch((error) => {
    console.error("Error al cargar el catálogo:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
