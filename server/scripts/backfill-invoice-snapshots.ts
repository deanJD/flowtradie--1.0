import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const settings = await prisma.companySettings.findFirst();
  if (!settings) {
    console.warn("No CompanySettings found. Skipping backfill.");
    return;
  }

  const { businessName, abn, address, phone, email, website, logoUrl, bankDetails } = settings;

  // Backfill any invoice that doesn’t have businessName set
  await prisma.invoice.updateMany({
    where: { businessName: null },
    data: {
      businessName,
      abn,
      address,
      phone,
      email,
      website,
      logoUrl,
      bankDetails,
    },
  });

  console.log("Backfill complete.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
