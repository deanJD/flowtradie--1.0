/*
  Warnings:

  - Added the required column `updatedAt` to the `JobExpense` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."JobExpense" DROP CONSTRAINT "JobExpense_jobId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Task" DROP CONSTRAINT "Task_jobId_fkey";

-- AlterTable
ALTER TABLE "public"."JobExpense" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "public"."User" ALTER COLUMN "role" DROP NOT NULL,
ALTER COLUMN "role" DROP DEFAULT;

-- AddForeignKey
ALTER TABLE "public"."Task" ADD CONSTRAINT "Task_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "public"."Job"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."JobExpense" ADD CONSTRAINT "JobExpense_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "public"."Job"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
