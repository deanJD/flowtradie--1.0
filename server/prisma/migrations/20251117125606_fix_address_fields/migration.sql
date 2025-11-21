/*
  Warnings:

  - You are about to drop the column `line1` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the column `line2` on the `Address` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Address" DROP COLUMN "line1",
DROP COLUMN "line2",
ADD COLUMN     "addressLine1" TEXT,
ADD COLUMN     "addressLine2" TEXT,
ALTER COLUMN "city" DROP NOT NULL,
ALTER COLUMN "postcode" DROP NOT NULL,
ALTER COLUMN "country" DROP NOT NULL;
