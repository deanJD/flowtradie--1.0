// prisma/seeds/seedInvoiceSettings.ts
import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export default async function seedInvoiceSettings() {
  console.log("🌱 Seeding InvoiceSettings...")

  // 1) Find the Business
  const business = await prisma.business.findFirst({
    where: { email: "contact@flowtradie.com" },
  })

  if (!business) {
    console.error("❌ Business not found. Run seedBusiness first.")
    return
  }

  // 2) Upsert InvoiceSettings for the Business
  const settings = await prisma.invoiceSettings.upsert({
    where: { businessId: business.id },
    update: {},
    create: {
      businessId: business.id,

      // Basic branding
      businessName: "FlowTradie Pty Ltd",
      abn: "ABN 00 000 000 000",

      // Display address (invoice address)
      addressLine1: "123 Example Street",
      addressLine2: null,
      city: "Perth",
      state: "WA",
      postcode: "6000",
      country: "Australia",

      phone: "0400 000 000",
      email: "accounts@flowtradie.com",
      website: "https://flowtradie.com",
      logoUrl: null,
      bankDetails: "BSB 000-000  |  ACC 00000000",

      // Default invoice numbering
      invoicePrefix: "INV-",
      startingNumber: 1000,
      defaultDueDays: 14,
      taxRate: 10.0,

      // SMTP not configured yet
      smtpHost: null,
      smtpPort: null,
      smtpUser: null,
      smtpPassword: null,
      fromEmail: null,
      fromName: null,
    },
  })

  console.log("   ➤ InvoiceSettings seeded:", settings.id)
}
