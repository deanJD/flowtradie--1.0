// prisma/seeds/seedBusiness.ts
import { PrismaClient, AddressType } from "@prisma/client";
const prisma = new PrismaClient();

export default async function seedBusiness() {
  console.log("🌱 Seeding Business...");

  // 1) Get AU region
  const region = await prisma.region.findUnique({
    where: { code: "AU" },
  });

  if (!region) {
    console.error("❌ Region AU not found. Run seedRegion first.");
    return;
  }

  // 2) Create Business + Address
  const address = await prisma.address.create({
    data: {
      addressType: AddressType.BUSINESS,
      line1: "123 Demo Street",
      line2: null,
      city: "Perth",
      state: "WA",
      postcode: "6000",
      country: "Australia",
      countryCode: "AU",
    },
  });

  const business = await prisma.business.create({
    data: {
      name: "FlowTradie Pty Ltd",
      legalName: "FlowTradie Pty Ltd",
      registrationNumber: "ABN 00 000 000 000",
      email: "contact@flowtradie.com",
      phone: "0400 000 000",
      website: "https://flowtradie.com",
      logoUrl: null,

      region: { connect: { id: region.id } },
      address: { connect: { id: address.id } },
    },
    include: { region: true, address: true },
  });

  // 3) Seed FIRST Invoice Settings automatically
  await prisma.invoiceSettings.upsert({
    where: { businessId: business.id },
    update: {}, // No update needed now
    create: {
      businessId: business.id,
      businessName: business.name,
      abn: business.registrationNumber,
      phone: business.phone,
      email: business.email,
      website: business.website,
      logoUrl: business.logoUrl,

      // JSON STRUCTURED ADDRESS SNAPSHOT
      addressSnapshot: {
        line1: address.line1,
        line2: address.line2,
        city: address.city,
        state: address.state,
        postcode: address.postcode,
        country: address.country,
        countryCode: address.countryCode,
      },

      invoicePrefix: "INV-",
      startingNumber: 1000,
      defaultDueDays: 14,
      taxRate: 0.10,
      bankDetails: "Bank of Perth - BSB: 000-000 ACC: 12345678",
    },
  });

  console.log("   ➤ Business + InvoiceSettings seeded:", business.id);
}
