// server/prisma/seeds/seedInvoiceSettings.ts
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export default async function seedInvoiceSettings() {
    console.log("🌱 Seeding InvoiceSettings...");
    const business = await prisma.business.findFirst({
        where: { email: "contact@flowtradie.com" },
    });
    if (!business) {
        console.error("❌ Business not found. Run seedBusiness first.");
        return;
    }
    const settings = await prisma.invoiceSettings.upsert({
        where: { businessId: business.id },
        update: {
            bankDetails: "BSB 000-000 | ACC 00000000",
            invoicePrefix: "INV-",
            startingNumber: 1000,
            defaultDueDays: 14,
            smtpHost: null,
            smtpPort: null,
            smtpUser: null,
            smtpPassword: null,
            fromEmail: null,
            fromName: null,
        },
        create: {
            businessId: business.id,
            bankDetails: "BSB 000-000 | ACC 00000000",
            invoicePrefix: "INV-",
            startingNumber: 1000,
            defaultDueDays: 14,
            smtpHost: null,
            smtpPort: null,
            smtpUser: null,
            smtpPassword: null,
            fromEmail: null,
            fromName: null,
        },
    });
    console.log("   ➤ InvoiceSettings seeded:", settings.id);
}
seedInvoiceSettings()
    .catch((err) => console.error(err))
    .finally(async () => prisma.$disconnect());
//# sourceMappingURL=seedInvoiceSettings.js.map