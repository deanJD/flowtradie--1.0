/*
  Warnings:

  - Added the required column `subtotal` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gstAmount` to the `Quote` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subtotal` to the `Quote` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Invoice" ADD COLUMN     "gstAmount" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
ADD COLUMN     "gstRate" DOUBLE PRECISION NOT NULL DEFAULT 0.1,
ADD COLUMN     "subtotal" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "public"."Quote" ADD COLUMN     "gstAmount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "gstRate" DOUBLE PRECISION NOT NULL DEFAULT 0.1,
ADD COLUMN     "subtotal" DOUBLE PRECISION NOT NULL;
