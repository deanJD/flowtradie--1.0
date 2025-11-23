// prisma/seeds/seedBusiness.ts
import { PrismaClient, AddressType } from "@prisma/client";
const prisma = new PrismaClient();
export default async function seedBusiness() {
    console.log("🌱 Seeding Business...");
    // 🔹 1) Get AU region
    const region = await prisma.region.findUnique({
        where: { code: "AU" },
    });
    if (!region) {
        console.error("❌ Region AU not found. Run seedRegion first.");
        return;
    }
    // 🔹 2) Create Business Address
    const address = await prisma.address.create({
        data: {
            addressType: AddressType.BUSINESS,
            line1: "123 Demo Street",
            city: "Perth",
            state: "WA",
            postcode: "6000",
            country: "Australia",
            countryCode: "AU",
        },
    });
    // 🔹 3) Create Business
    const business = await prisma.business.create({
        data: {
            name: "FlowTradie Pty Ltd",
            legalName: "FlowTradie Pty Ltd",
            registrationNumber: "ABN 00 000 000 000",
            email: "contact@flowtradie.com",
            phone: "0400 000 000",
            website: "https://flowtradie.com",
            region: { connect: { id: region.id } },
            address: { connect: { id: address.id } },
        },
        include: { region: true, address: true },
    });
    console.log("   ➤ Business seeded:", business.id);
}
// 🧼 IMPORTANT — disconnect to avoid hanging
seedBusiness()
    .catch((err) => console.error(err))
    .finally(async () => await prisma.$disconnect());
//# sourceMappingURL=seedBusiness.js.map