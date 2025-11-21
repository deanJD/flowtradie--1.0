// prisma/seeds/seedBusiness.ts
import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export default async function seedBusiness() {
  console.log("🌱 Seeding Business...")

  // 1) Get AU region
  const region = await prisma.region.findUnique({
    where: { code: "AU" },
  })

  if (!region) {
    console.error("❌ Region AU not found. Run seedRegion first.")
    return
  }

  // 2) Create Business
  const business = await prisma.business.upsert({
    where: { id: "your-business-id" }, // replace with the actual business id
    update: {},
    create: {
      name: "FlowTradie Pty Ltd",
      legalName: "FlowTradie Pty Ltd",
      registrationNumber: "ABN 00 000 000 000",
      email: "contact@flowtradie.com",
      phone: "0400 000 000",
      website: "https://flowtradie.com",
      logoUrl: null,

      region: {
        connect: { id: region.id },
      },

      // invoice defaults
      invoicePrefix: "INV",
      nextInvoiceNumber: 1,
      defaultDueDays: 14,
      defaultNotes: "Payment due within 14 days.",
    },
  })

  console.log("   ➤ Business seeded:", business.id)
}
