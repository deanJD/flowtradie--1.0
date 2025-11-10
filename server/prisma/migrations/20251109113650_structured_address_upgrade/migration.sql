/*
  Warnings:

  - You are about to drop the column `address` on the `Invoice` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Invoice" DROP COLUMN "address",
ADD COLUMN     "addressLine1" TEXT,
ADD COLUMN     "addressLine2" TEXT,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "postcode" TEXT,
ADD COLUMN     "state" TEXT,
ALTER COLUMN "businessName" DROP NOT NULL;

-- AlterTable
ALTER TABLE "InvoiceSettings" ALTER COLUMN "gstRate" SET DEFAULT 0.1;
