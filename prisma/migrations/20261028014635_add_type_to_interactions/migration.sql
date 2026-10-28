-- CreateEnum
CREATE TYPE "InteractionType" AS ENUM ('producto', 'michi');

-- AlterTable
ALTER TABLE "interactions" ADD COLUMN     "tipo" "InteractionType" NOT NULL DEFAULT 'producto';
