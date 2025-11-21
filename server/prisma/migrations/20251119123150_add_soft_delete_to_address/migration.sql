/*
  Warnings:

  - You are about to drop the column `addressLine1` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the column `addressLine2` on the `Address` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Address" DROP COLUMN "addressLine1",
DROP COLUMN "addressLine2",
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "line1" TEXT,
ADD COLUMN     "line2" TEXT;
