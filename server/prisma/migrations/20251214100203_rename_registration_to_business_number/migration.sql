/*
  Warnings:

  - You are about to drop the column `registrationNumber` on the `Business` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[addressId]` on the table `Business` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Business" DROP COLUMN "registrationNumber",
ADD COLUMN     "businessNumber" TEXT,
ADD COLUMN     "businessType" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Business_addressId_key" ON "Business"("addressId");
