-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "siteAddressId" TEXT;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_siteAddressId_fkey" FOREIGN KEY ("siteAddressId") REFERENCES "Address"("id") ON DELETE SET NULL ON UPDATE CASCADE;
