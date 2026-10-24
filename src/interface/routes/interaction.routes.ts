
import { Router } from "express";
import { postInteraction } from "../controllers/create-interaction.controller.js";
import { getMyInteractions } from "../controllers/list-my-interactions.controller.js";
import { getAllInteractions } from "../controllers/list-interactions.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

const router = Router();

router.post(
  "/api/interactions",
  authenticateToken,
  postInteraction
);

router.get(
  "/api/interactions/mias",
  authenticateToken,
  getMyInteractions
);

router.get(
  "/api/interactions",
  authenticateToken,
  authorizeRoles("admin"),
  getAllInteractions
);

export default router;
