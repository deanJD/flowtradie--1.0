// server/prisma/seeds/seedProject.ts
import { PrismaClient, AddressType } from "@prisma/client";

export default async function seedProject(prisma: PrismaClient) {
  console.log("🌱 Seeding projects...");

  const business = await prisma.business.findFirst();
  if (!business) throw new Error("Business not found – seedBusiness must run first");

  const clients = await prisma.client.findMany({
    where: { businessId: business.id },
  });

  if (clients.length === 0) {
    console.log("   ➤ No clients found – seedClient must run first");
    return;
  }

  const existingCount = await prisma.project.count({
    where: { businessId: business.id },
  });

  if (existingCount > 0) {
    console.log(`   ➤ ${existingCount} projects already exist – skipping`);
    return;
  }

  let created = 0;

  for (const client of clients) {
    const label =
      client.businessName ?? `${client.firstName} ${client.lastName}`;

    // 1️⃣ Create bathroom address
    const bathroomAddress = await prisma.address.create({
      data: {
        addressType: AddressType.SITE,
        line1: "123 Renovation St",
        line2: null,
        city: "Perth",
        state: "WA",
        postcode: "6000",
        country: "Australia",
        countryCode: "AU",
      },
    });

    // Project 1 – Bathroom
    await prisma.project.create({
      data: {
        businessId: business.id,
        clientId: client.id,
        title: `${label} - Bathroom Renovation`,
        description: "Full bathroom renovation including plumbing and tiling.",
        status: "ACTIVE",
        budgetedAmount: 15000,
        siteAddressId: bathroomAddress.id,
      },
    });
    created++;

    // 2️⃣ Create kitchen address
    const kitchenAddress = await prisma.address.create({
      data: {
        addressType: AddressType.SITE,
        line1: "45 Kitchen Rd",
        line2: null,
        city: "Perth",
        state: "WA",
        postcode: "6000",
        country: "Australia",
        countryCode: "AU",
      },
    });

    // Project 2 – Kitchen
    await prisma.project.create({
      data: {
        businessId: business.id,
        clientId: client.id,
        title: `${label} - Kitchen Upgrade`,
        description: "Kitchen cabinetry, electrical and appliances upgrade.",
        status: "PENDING",
        budgetedAmount: 22000,
        siteAddressId: kitchenAddress.id,
      },
    });
    created++;
  }

  console.log(`   ➤ Seeded ${created} projects with Perth site addresses`);
}
