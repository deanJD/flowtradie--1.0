// prisma/seeds/seedRegion.ts
import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export default async function seedRegion() {
  console.log("🌱 Seeding Regions...")

  // Only seed Australia for now
  const regionAU = await prisma.region.upsert({
    where: { code: "AU" },
    update: {},
    create: {
      code: "AU",
      name: "Australia",
      currencyCode: "AUD",
      currencySymbol: "$",
      taxLabel: "GST",
      defaultTaxRate: 10.0, // 10%
      locale: "en-AU",
    },
  })

  console.log("   ➤ Region AU seeded:", regionAU.id)
}
