-- AlterTable
ALTER TABLE "interactions" ADD COLUMN     "productId" INTEGER;

-- CreateIndex
CREATE INDEX "interactions_productId_idx" ON "interactions"("productId");

-- AddForeignKey
ALTER TABLE "interactions" ADD CONSTRAINT "interactions_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;
