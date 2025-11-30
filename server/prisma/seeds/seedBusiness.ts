// prisma/seeds/seedBusiness.ts
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function seedBusiness() {
  console.log("🌱 Seeding Business...");

  // 1) Find Region FIRST — MUST EXIST
  const region = await prisma.region.findFirst({
    where: { code: "AU" },
  });

  if (!region) {
    console.error("❌ Region AU not found.");
    return;
  }

  // 2) Create Address
  const address = await prisma.address.create({
    data: {
      addressType: "BUSINESS",
      line1: "123 Demo Street",
      city: "Perth",
      state: "WA",
      postcode: "6000",
      country: "Australia",
      countryCode: "AU",
    },
  });

  // 3) Create Business
  const business = await prisma.business.create({
    data: {
      name: "FlowTradie Pty Ltd",
      legalName: "FlowTradie Pty Ltd",
      registrationNumber: "ABN 00 000 000 000",
      email: "contact@flowtradie.com",
      phone: "0400 000 000",
      website: "https://flowtradie.com",

      regionId: region.id,
      addressId: address.id,
    },
  });

  // 4) Create Invoice Settings — NOW DYNAMIC BASED ON REGION!
  await prisma.invoiceSettings.create({
    data: {
      businessId: business.id,
      businessName: business.name,
      abn: business.registrationNumber,
      phone: business.phone,
      email: business.email,
      website: business.website,

      addressSnapshot: {
        line1: address.line1,
        city: address.city,
        state: address.state,
        postcode: address.postcode,
        country: address.country,
        countryCode: address.countryCode,
      },

      invoicePrefix: "INV-",
      startingNumber: 1000,
      defaultDueDays: 14,

      // 🔥 Auto pulled from Region model
      taxLabel: region.taxLabel,
      taxRate: region.defaultTaxRate,

      bankDetails: "Bank of Perth - BSB 000-000 / ACC 12345678",
    },
  });

  console.log("   ➤ Business + Settings seeded:", business.id);
}
