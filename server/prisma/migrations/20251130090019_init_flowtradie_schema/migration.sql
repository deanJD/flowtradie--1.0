/*
  Warnings:

  - Added the required column `clientId` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "InvoiceStatus" ADD VALUE 'DELETED';

-- AlterEnum
ALTER TYPE "ProjectStatus" ADD VALUE 'DELETED';

-- AlterEnum
ALTER TYPE "QuoteStatus" ADD VALUE 'DELETED';

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "clientId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "BillableItem_businessId_idx" ON "BillableItem"("businessId");

-- CreateIndex
CREATE INDEX "Business_regionId_idx" ON "Business"("regionId");

-- CreateIndex
CREATE INDEX "Client_businessId_idx" ON "Client"("businessId");

-- CreateIndex
CREATE INDEX "Invoice_businessId_idx" ON "Invoice"("businessId");

-- CreateIndex
CREATE INDEX "Invoice_projectId_idx" ON "Invoice"("projectId");

-- CreateIndex
CREATE INDEX "Invoice_clientId_idx" ON "Invoice"("clientId");

-- CreateIndex
CREATE INDEX "Invoice_status_idx" ON "Invoice"("status");

-- CreateIndex
CREATE INDEX "Payment_businessId_idx" ON "Payment"("businessId");

-- CreateIndex
CREATE INDEX "Payment_invoiceId_idx" ON "Payment"("invoiceId");

-- CreateIndex
CREATE INDEX "Payment_clientId_idx" ON "Payment"("clientId");

-- CreateIndex
CREATE INDEX "Payment_date_idx" ON "Payment"("date");

-- CreateIndex
CREATE INDEX "Project_businessId_idx" ON "Project"("businessId");

-- CreateIndex
CREATE INDEX "Project_clientId_idx" ON "Project"("clientId");

-- CreateIndex
CREATE INDEX "Project_managerId_idx" ON "Project"("managerId");

-- CreateIndex
CREATE INDEX "Project_status_idx" ON "Project"("status");

-- CreateIndex
CREATE INDEX "ProjectExpense_projectId_idx" ON "ProjectExpense"("projectId");

-- CreateIndex
CREATE INDEX "ProjectExpense_date_idx" ON "ProjectExpense"("date");

-- CreateIndex
CREATE INDEX "Quote_businessId_idx" ON "Quote"("businessId");

-- CreateIndex
CREATE INDEX "Quote_projectId_idx" ON "Quote"("projectId");

-- CreateIndex
CREATE INDEX "Quote_status_idx" ON "Quote"("status");

-- CreateIndex
CREATE INDEX "Region_code_idx" ON "Region"("code");

-- CreateIndex
CREATE INDEX "Task_projectId_idx" ON "Task"("projectId");

-- CreateIndex
CREATE INDEX "Task_assignedToId_idx" ON "Task"("assignedToId");

-- CreateIndex
CREATE INDEX "TimeLog_projectId_idx" ON "TimeLog"("projectId");

-- CreateIndex
CREATE INDEX "TimeLog_userId_idx" ON "TimeLog"("userId");

-- CreateIndex
CREATE INDEX "TimeLog_date_idx" ON "TimeLog"("date");

-- CreateIndex
CREATE INDEX "User_businessId_idx" ON "User"("businessId");

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
