import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function seedClient(prisma: PrismaClient) {
  console.log("🌱 Seeding clients...");

  const business = await prisma.business.findFirst();
  if (!business) throw new Error("Business not found – seedBusiness must run first");

  const existingCount = await prisma.client.count({
    where: { businessId: business.id },
  });

  if (existingCount > 0) {
    console.log(`   ➤ ${existingCount} clients already exist – skipping`);
    return;
  }

  const clientsData = [
    {
      firstName: "John",
      lastName: "Smith",
      businessName: "Smith Plumbing Pty Ltd",
      phone: "0400 111 111",
      email: "admin@smithplumbing.test",
      type: "COMMERCIAL" as const,
      businessId: business.id,
    },
    {
      firstName: "Sarah",
      lastName: "Lee",
      businessName: "Rapid Electrical",
      phone: "0400 222 222",
      email: "office@rapidelec.test",
      type: "COMMERCIAL" as const,
      businessId: business.id,
    },
    {
      firstName: "Michael",
      lastName: "Brown",
      businessName: null,
      phone: "0400 333 333",
      email: "michael.brown@example.test",
      type: "RESIDENTIAL" as const,
      businessId: business.id,
    },
  ];

  await prisma.client.createMany({ data: clientsData });

  console.log(`   ➤ Seeded ${clientsData.length} clients`);
}
