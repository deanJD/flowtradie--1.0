/*
  Warnings:

  - You are about to drop the column `address` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `address` on the `InvoiceSettings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Client" DROP COLUMN "address",
ADD COLUMN     "addressLine1" TEXT,
ADD COLUMN     "addressLine2" TEXT,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "postcode" TEXT,
ADD COLUMN     "state" TEXT;

-- AlterTable
ALTER TABLE "InvoiceSettings" DROP COLUMN "address",
ADD COLUMN     "addressLine1" TEXT,
ADD COLUMN     "addressLine2" TEXT,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "postcode" TEXT,
ADD COLUMN     "state" TEXT;
