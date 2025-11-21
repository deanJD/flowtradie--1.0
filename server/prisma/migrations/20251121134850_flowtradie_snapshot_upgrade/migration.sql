/*
  Warnings:

  - You are about to drop the column `defaultDueDays` on the `Business` table. All the data in the column will be lost.
  - You are about to drop the column `defaultNotes` on the `Business` table. All the data in the column will be lost.
  - You are about to drop the column `invoicePrefix` on the `Business` table. All the data in the column will be lost.
  - You are about to drop the column `nextInvoiceNumber` on the `Business` table. All the data in the column will be lost.
  - You are about to drop the column `addressId` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `abn` on the `Invoice` table. All the data in the column will be lost.
  - You are about to drop the column `addressLine1` on the `Invoice` table. All the data in the column will be lost.
  - You are about to drop the column `addressLine2` on the `Invoice` table. All the data in the column will be lost.
  - You are about to drop the column `bankDetails` on the `Invoice` table. All the data in the column will be lost.
  - You are about to drop the column `businessName` on the `Invoice` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `Invoice` table. All the data in the column will be lost.
  - You are about to drop the column `clientAddressLine1` on the `Invoice` table. All the data in the column will be lost.
  - You are about to drop the column `clientAddressLine2` on the `Invoice` table. All the data in the column will be lost.
  - You are about to drop the column `clientCity` on the `Invoice` table. All the data in the column will be lost.
  - You are about to drop the column `clientCountry` on the `Invoice` table. All the data in the column will be lost.
  - You are about to drop the column `clientEmail` on the `Invoice` table. All the data in the column will be lost.
  - You are about to drop the column `clientName` on the `Invoice` table. All the data in the column will be lost.
  - You are about to drop the column `clientPostcode` on the `Invoice` table. All the data in the column will be lost.
  - You are about to drop the column `clientState` on the `Invoice` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `Invoice` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `Invoice` table. All the data in the column will be lost.
  - You are about to drop the column `logoUrl` on the `Invoice` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `Invoice` table. All the data in the column will be lost.
  - You are about to drop the column `postcode` on the `Invoice` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `Invoice` table. All the data in the column will be lost.
  - You are about to drop the column `website` on the `Invoice` table. All the data in the column will be lost.
  - You are about to drop the column `addressLine1` on the `InvoiceSettings` table. All the data in the column will be lost.
  - You are about to drop the column `addressLine2` on the `InvoiceSettings` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `InvoiceSettings` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `InvoiceSettings` table. All the data in the column will be lost.
  - You are about to drop the column `postcode` on the `InvoiceSettings` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `InvoiceSettings` table. All the data in the column will be lost.
  - Made the column `city` on table `Address` required. This step will fail if there are existing NULL values in that column.
  - Made the column `postcode` on table `Address` required. This step will fail if there are existing NULL values in that column.
  - Made the column `line1` on table `Address` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `firstName` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `businessSnapshot` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clientSnapshot` to the `Invoice` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AddressType" AS ENUM ('BUSINESS', 'SITE', 'CLIENT_BUSINESS', 'CLIENT_SITE', 'OTHER');

-- DropForeignKey
ALTER TABLE "public"."Client" DROP CONSTRAINT "Client_addressId_fkey";

-- AlterTable
ALTER TABLE "Address" ADD COLUMN     "addressType" "AddressType" NOT NULL DEFAULT 'BUSINESS',
ADD COLUMN     "countryCode" TEXT,
ALTER COLUMN "city" SET NOT NULL,
ALTER COLUMN "postcode" SET NOT NULL,
ALTER COLUMN "line1" SET NOT NULL;

-- AlterTable
ALTER TABLE "Business" DROP COLUMN "defaultDueDays",
DROP COLUMN "defaultNotes",
DROP COLUMN "invoicePrefix",
DROP COLUMN "nextInvoiceNumber",
ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Client" DROP COLUMN "addressId",
DROP COLUMN "name",
ADD COLUMN     "businessName" TEXT,
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Invoice" DROP COLUMN "abn",
DROP COLUMN "addressLine1",
DROP COLUMN "addressLine2",
DROP COLUMN "bankDetails",
DROP COLUMN "businessName",
DROP COLUMN "city",
DROP COLUMN "clientAddressLine1",
DROP COLUMN "clientAddressLine2",
DROP COLUMN "clientCity",
DROP COLUMN "clientCountry",
DROP COLUMN "clientEmail",
DROP COLUMN "clientName",
DROP COLUMN "clientPostcode",
DROP COLUMN "clientState",
DROP COLUMN "country",
DROP COLUMN "email",
DROP COLUMN "logoUrl",
DROP COLUMN "phone",
DROP COLUMN "postcode",
DROP COLUMN "state",
DROP COLUMN "website",
ADD COLUMN     "businessSnapshot" JSONB NOT NULL,
ADD COLUMN     "clientSnapshot" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "InvoiceSettings" DROP COLUMN "addressLine1",
DROP COLUMN "addressLine2",
DROP COLUMN "city",
DROP COLUMN "country",
DROP COLUMN "postcode",
DROP COLUMN "state",
ADD COLUMN     "addressSnapshot" JSONB;

-- AlterTable
ALTER TABLE "Region" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "_ClientAddresses" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ClientAddresses_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ClientAddresses_B_index" ON "_ClientAddresses"("B");

-- AddForeignKey
ALTER TABLE "_ClientAddresses" ADD CONSTRAINT "_ClientAddresses_A_fkey" FOREIGN KEY ("A") REFERENCES "Address"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClientAddresses" ADD CONSTRAINT "_ClientAddresses_B_fkey" FOREIGN KEY ("B") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;
