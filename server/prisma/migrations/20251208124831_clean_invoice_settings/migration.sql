/*
  Warnings:

  - You are about to drop the column `abn` on the `InvoiceSettings` table. All the data in the column will be lost.
  - You are about to drop the column `addressSnapshot` on the `InvoiceSettings` table. All the data in the column will be lost.
  - You are about to drop the column `bankDetails` on the `InvoiceSettings` table. All the data in the column will be lost.
  - You are about to drop the column `businessName` on the `InvoiceSettings` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `InvoiceSettings` table. All the data in the column will be lost.
  - You are about to drop the column `logoUrl` on the `InvoiceSettings` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `InvoiceSettings` table. All the data in the column will be lost.
  - You are about to drop the column `website` on the `InvoiceSettings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "InvoiceSettings" DROP COLUMN "abn",
DROP COLUMN "addressSnapshot",
DROP COLUMN "bankDetails",
DROP COLUMN "businessName",
DROP COLUMN "email",
DROP COLUMN "logoUrl",
DROP COLUMN "phone",
DROP COLUMN "website";
