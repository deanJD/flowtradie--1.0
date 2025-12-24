import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function seedBusiness(prisma: PrismaClient) {
  console.log("🌱 Seeding business...");

  const existing = await prisma.business.findFirst();
  if (existing) {
    console.log(`   ➤ Business already exists: ${existing.name}`);
    return;
  }

  const region = await prisma.region.findUnique({ where: { code: "AU" } });
  if (!region) throw new Error("Region AU not found – seedRegion must run first");

  const business = await prisma.business.create({
    data: {
      name: "FlowTradie",
      legalName: "FlowTradie Pty Ltd",
      logoUrl: null,
      businessNumber: "12 345 678 901",
      businessType: "Company",
      email: "admin@flowtradie.test",
      phone: "0400 000 000",
      website: "https://flowtradie.test",
      regionId: region.id,
    },
  });

  console.log(`   ➤ Business created: ${business.name}`);
}
