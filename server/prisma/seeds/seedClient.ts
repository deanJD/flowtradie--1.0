// prisma/seeds/seedClient.ts
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function seedClient() {
  const businessId = "cmid2gv1h000395r8qg9c6ulq"; // 🔥 YOUR business ID

  await prisma.client.createMany({
    data: [
      {
        businessId,
        firstName: "John",
        lastName: "Builder",
        businessName: "JB Carpentry",
        email: "john@jbcarpentry.com",
        phone: "0400 123 456",
        type: "COMMERCIAL",
      },
      {
        businessId,
        firstName: "Sarah",
        lastName: "Sparks",
        businessName: "Sparks Electrical",
        email: "sarah@sparks.com",
        phone: "0401 987 654",
        type: "COMMERCIAL",
      },
      {
        businessId,
        firstName: "Michael",
        lastName: "Plumb",
        businessName: "MP Plumbing Co.",
        email: "michael@mpplumbing.com",
        phone: "0407 654 321",
        type: "RESIDENTIAL",
      },
      {
        businessId,
        firstName: "Lisa",
        lastName: "Painter",
        businessName: "Perfect Paint",
        email: "lisa@perfectpaint.com",
        phone: "0402 888 999",
        type: "RESIDENTIAL",
      },
      {
        businessId,
        firstName: "Dave",
        lastName: "Concrete",
        businessName: "DC Concreting",
        email: "dave@dcconcrete.com",
        phone: "0412 456 789",
        type: "COMMERCIAL",
      },
    ],
  });

  console.log("🔥 Seeded 5 clients successfully!");
}
