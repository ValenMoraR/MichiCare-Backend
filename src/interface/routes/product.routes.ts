
import { Router } from "express";
import { getProducts } from "../controllers/product.controller.js";
import { postProduct } from "../controllers/create-product.controller.js";
import { putProduct } from "../controllers/update-product.controller.js";
import { deleteProductById } from "../controllers/delete-product.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
import { getProductById } from "../controllers/get-product-by-id.controller.js";

const router = Router();

// Consultar el catálogo con paginación.
router.get("/api/products", getProducts);

// Consultar un producto por su identificador.
router.get("/api/products/:id", getProductById);

// Crear productos: solo para administradores autenticados.
router.post(
  "/api/products",
  authenticateToken,
  authorizeRoles("admin"),
  postProduct,
);

// Actualizar productos: solo para administradores autenticados.
router.put(
  "/api/products/:id",
  authenticateToken,
  authorizeRoles("admin"),
  putProduct,
);

// Eliminar productos: solo para administradores autenticados.
router.delete(
  "/api/products/:id",
  authenticateToken,
  authorizeRoles("admin"),
  deleteProductById,
);

export default router;
