import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function seedRegion(prisma: PrismaClient) {
  console.log("🌱 Seeding regions...");

  const regions = [
    {
      code: "AU",
      name: "Australia",
      currencyCode: "AUD",
      currencySymbol: "$",
      taxLabel: "GST",
      defaultTaxRate: 0.1,
      locale: "en-AU",
    },
    {
      code: "NZ",
      name: "New Zealand",
      currencyCode: "NZD",
      currencySymbol: "$",
      taxLabel: "GST",
      defaultTaxRate: 0.15,
      locale: "en-NZ",
    },
    {
      code: "UK",
      name: "United Kingdom",
      currencyCode: "GBP",
      currencySymbol: "£",
      taxLabel: "VAT",
      defaultTaxRate: 0.2,
      locale: "en-GB",
    },
    {
      code: "US",
      name: "United States",
      currencyCode: "USD",
      currencySymbol: "$",
      taxLabel: "Sales Tax",
      defaultTaxRate: 0,
      locale: "en-US",
    },
  ];

  for (const region of regions) {
    await prisma.region.upsert({
      where: { code: region.code },
      update: {},
      create: region,
    });
  }

  console.log(`   ➤ Regions upserted`);
}
