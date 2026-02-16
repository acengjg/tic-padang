-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'CULINARY';

-- DropIndex
DROP INDEX "SouvenirVendor_userId_key";

-- AlterTable
ALTER TABLE "CulinarySpot" ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'APPROVED',
ADD COLUMN     "userId" TEXT;

-- AlterTable
ALTER TABLE "SouvenirVendor" ADD COLUMN     "videoUrl" TEXT;

-- CreateTable
CREATE TABLE "CulinaryMenu" (
    "id" TEXT NOT NULL,
    "spotId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CulinaryMenu_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CulinarySpot" ADD CONSTRAINT "CulinarySpot_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CulinaryMenu" ADD CONSTRAINT "CulinaryMenu_spotId_fkey" FOREIGN KEY ("spotId") REFERENCES "CulinarySpot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
