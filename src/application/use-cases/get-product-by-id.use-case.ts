
import { prisma } from "../../infrastructure/database/prisma.js";

export class GetProductById {
  async execute(id: number) {
    if (!Number.isInteger(id) || id < 1) {
      throw new Error("INVALID_PRODUCT_ID");
    }

    const producto = await prisma.product.findUnique({
      where: { id },
    });

    if (!producto) {
      throw new Error("PRODUCT_NOT_FOUND");
    }

    return producto;
  }
}
