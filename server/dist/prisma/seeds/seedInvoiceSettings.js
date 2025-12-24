import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export default async function seedInvoiceSettings(prisma) {
    console.log("🌱 Seeding invoice settings...");
    const business = await prisma.business.findFirst();
    if (!business)
        throw new Error("Business not found – seedBusiness must run first");
    const existing = await prisma.invoiceSettings.findUnique({
        where: { businessId: business.id },
    });
    if (existing) {
        console.log("   ➤ Invoice settings already exist – skipping");
        return;
    }
    await prisma.invoiceSettings.create({
        data: {
            businessId: business.id,
            invoicePrefix: "FT-",
            startingNumber: 1,
            defaultDueDays: 14,
        },
    });
    console.log("   ➤ Invoice settings seeded");
}
//# sourceMappingURL=seedInvoiceSettings.js.map