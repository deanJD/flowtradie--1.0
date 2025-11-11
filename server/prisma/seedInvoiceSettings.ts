import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.invoiceSettings.findFirst();
  if (existing) {
    console.log("⚠️  Invoice settings already exist in the database.");
    return;
  }

  // ✅ Create your default Invoice Settings record
  const settings = await prisma.invoiceSettings.create({
     data: {
    businessName: "FlowTradie",
    abn: "123456789",

    addressLine1: "1 Rise Rd",
    addressLine2: "",
    city: "Perth",
    state: "WA",
    postcode: "6000",
    country: "Australia",

    phone: "0400 000 000",
    email: "admin@flowtradie.com",
    website: "flowtradie.com",
    logoUrl: "/uploads/logo/default.png",
    bankDetails: "BSB 000-000, ACC 00000000",

    invoicePrefix: "INV-",
    startingNumber: 1000,
    defaultDueDays: 14,
    gstRate: 0.10,

    smtpHost: "",
    smtpPort: 587,
    smtpUser: "",
    smtpPassword: "",
    fromEmail: "",
    fromName: "",
  },
});

  console.log("✅ Invoice settings saved to your database:");
  console.log(settings);
}

main()
  .catch((e) => {
    console.error("❌ Error seeding invoice settings:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
