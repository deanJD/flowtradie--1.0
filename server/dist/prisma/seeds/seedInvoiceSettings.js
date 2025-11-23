// prisma/seeds/seedInvoiceSettings.ts
import { PrismaClient, Prisma } from "@prisma/client"; //  <-- IMPORTANT
const prisma = new PrismaClient();
export default async function seedInvoiceSettings() {
    console.log("🌱 Seeding InvoiceSettings...");
    // 1) Find the Business
    const business = await prisma.business.findFirst({
        where: { email: "contact@flowtradie.com" },
        include: { address: true },
    });
    if (!business) {
        console.error("❌ Business not found. Run seedBusiness first.");
        return;
    }
    // 2) Create structured JSON or NULL safely
    const addressSnapshot = business.address
        ? {
            line1: business.address.line1,
            line2: business.address.line2,
            city: business.address.city,
            state: business.address.state,
            postcode: business.address.postcode,
            country: business.address.country,
            countryCode: business.address.countryCode,
        }
        : Prisma.JsonNull; // <-- FIXED
    // 3) Upsert settings
    const settings = await prisma.invoiceSettings.upsert({
        where: { businessId: business.id },
        update: {},
        create: {
            businessId: business.id,
            businessName: business.name,
            abn: business.registrationNumber,
            phone: business.phone,
            email: business.email,
            website: business.website,
            logoUrl: business.logoUrl,
            bankDetails: "BSB 000-000 | ACC 00000000",
            addressSnapshot, // ✔ FIXED
            invoicePrefix: "INV-",
            startingNumber: 1000,
            defaultDueDays: 14,
            taxRate: 0.10, // DECIMAL in Prisma
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