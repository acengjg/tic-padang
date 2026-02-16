/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `SouvenirVendor` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `SouvenirVendor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'VENDOR';

-- AlterTable
ALTER TABLE "SouvenirVendor" ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "SouvenirVendor_userId_key" ON "SouvenirVendor"("userId");

-- AddForeignKey
ALTER TABLE "SouvenirVendor" ADD CONSTRAINT "SouvenirVendor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
