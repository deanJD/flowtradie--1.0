/*
  Warnings:

  - You are about to drop the column `taxLabel` on the `InvoiceSettings` table. All the data in the column will be lost.
  - You are about to drop the column `taxRate` on the `InvoiceSettings` table. All the data in the column will be lost.
  - Made the column `startingNumber` on table `InvoiceSettings` required. This step will fail if there are existing NULL values in that column.
  - Made the column `defaultDueDays` on table `InvoiceSettings` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Invoice" ALTER COLUMN "taxRate" DROP DEFAULT;

-- AlterTable
ALTER TABLE "InvoiceSettings" DROP COLUMN "taxLabel",
DROP COLUMN "taxRate",
ALTER COLUMN "startingNumber" SET NOT NULL,
ALTER COLUMN "defaultDueDays" SET NOT NULL;
