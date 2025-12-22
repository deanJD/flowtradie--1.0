import { PrismaClient, AddressType } from "@prisma/client";
const prisma = new PrismaClient();
export default async function seedBusiness() {
    console.log("🌱 Seeding Business...");
    const region = await prisma.region.findFirst({
        where: { code: "AU" },
    });
    if (!region) {
        console.error("❌ Region AU not found. Please seed regions first.");
        return;
    }
    // Reusable business identity details
    const scalars = {
        name: "FlowTradie Pty Ltd",
        legalName: "FlowTradie Pty Ltd",
        businessNumber: "ABN 00 000 000 000",
        businessType: "Company",
        email: "contact@flowtradie.com",
        phone: "0400 000 000",
        website: "https://flowtradie.com",
    };
    const DEMO_ID = "demo-business-id";
    const business = await prisma.business.upsert({
        where: { id: DEMO_ID },
        update: {
            ...scalars,
            regionId: region.id,
        },
        create: {
            id: DEMO_ID,
            ...scalars,
            region: {
                connect: { id: region.id },
            },
            address: {
                create: {
                    addressType: AddressType.BUSINESS,
                    line1: "123 Demo Street",
                    city: "Perth",
                    state: "WA",
                    postcode: "6000",
                    country: "Australia",
                    countryCode: "AU",
                },
            },
            invoiceSettings: {
                create: {
                    invoicePrefix: "INV-",
                    startingNumber: 1000,
                    defaultDueDays: 14,
                    bankDetails: "Bank of Perth - BSB 000-000 / ACC 12345678",
                    smtpHost: "smtp.postmarkapp.com",
                    smtpPort: 587,
                    fromEmail: "billing@flowtradie.com",
                    fromName: "FlowTradie Accounts",
                },
            },
        },
    });
    // Safety check for existing DBs that didn't have settings
    const existingSettings = await prisma.invoiceSettings.findUnique({
        where: { businessId: business.id },
    });
    if (!existingSettings) {
        await prisma.invoiceSettings.create({
            data: {
                businessId: business.id,
                invoicePrefix: "INV-",
                startingNumber: 1000,
                defaultDueDays: 14,
                bankDetails: "Bank of Perth - BSB 000-000 / ACC 12345678",
            },
        });
        console.log("   ➤ Created missing invoice settings.");
    }
    console.log("   ➤ Business + Settings seeded:", business.name);
}
//# sourceMappingURL=seedBusiness.js.map