
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.js";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("Falta configurar DATABASE_URL en el archivo .env");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const productos = [
  {
    id: 1,
    nombre: "Arena de gatos",
    descripcion: "Producto de higiene para gatos.",
    precio: 45000,
    imagen: "../images/arena.png",
    categoria: "higiene",
  },
  {
    id: 2,
    nombre: "Fuente de agua",
    descripcion: "Fuente de agua para gatos.",
    precio: 45000,
    imagen: "../images/fuente-agua.png",
    categoria: "alimentacion",
  },
  {
    id: 3,
    nombre: "Dispensador de alimentacion",
    descripcion: "Dispensador de alimento para gatos.",
    precio: 45000,
    imagen: "../images/dispensador-comida.png",
    categoria: "alimentacion",
  },
  {
    id: 4,
    nombre: "Cepillo para pelo",
    descripcion: "Cepillo para el cuidado del pelo de los gatos.",
    precio: 45000,
    imagen: "../images/cepillo-pelo.png",
    categoria: "higiene",
  },
  {
    id: 5,
    nombre: "Comida premium gatitos",
    descripcion: "Alimento para gatitos.",
    precio: 45000,
    imagen: "../images/comida-premium-gatitos.png",
    categoria: "alimentacion",
  },
  {
    id: 6,
    nombre: "Comida premium castrados",
    descripcion: "Alimento para gatos castrados.",
    precio: 45000,
    imagen: "../images/comida-premium-castrados.png",
    categoria: "alimentacion",
  },
  {
    id: 7,
    nombre: "Comida premium adultos",
    descripcion: "Alimento para gatos adultos.",
    precio: 45000,
    imagen: "../images/comida-premium.png",
    categoria: "alimentacion",
  },
  {
    id: 8,
    nombre: "Churus",
    descripcion: "Premio para gatos.",
    precio: 45000,
    imagen: "../images/churus.png",
    categoria: "alimentacion",
  },
  {
    id: 9,
    nombre: "Arenero automatico",
    descripcion: "Arenero automático para gatos.",
    precio: 45000,
    imagen: "../images/arenero-automatico.png",
    categoria: "higiene",
  },
  {
    id: 10,
    nombre: "Gimnasio para gatos",
    descripcion: "Espacio de juego y descanso para gatos.",
    precio: 45000,
    imagen: "../images/gimnasio.png",
    categoria: "descanso",
  },
  {
    id: 11,
    nombre: "Raton de juguete",
    descripcion: "Juguete para gatos.",
    precio: 45000,
    imagen: "../images/ratones-tela.png",
    categoria: "juguetes",
  },
];

async function main() {
  for (const producto of productos) {
    await prisma.product.upsert({
      where: { id: producto.id },
      update: {
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        precio: producto.precio,
        imagen: producto.imagen,
        categoria: producto.categoria,
      },
      create: producto,
    });
  }

  console.log(`Se cargaron ${productos.length} productos de MichiCare.`);
}

main()
  .catch((error) => {
    console.error("Error al cargar el catálogo:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
