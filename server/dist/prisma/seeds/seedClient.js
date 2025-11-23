// prisma/seeds/seedClient.ts
import { PrismaClient, ClientType } from "@prisma/client";
const prisma = new PrismaClient();
export default async function seedClient() {
    console.log("🌱 Seeding Client...");
    const business = await prisma.business.findFirst({
        where: { email: "contact@flowtradie.com" },
    });
    if (!business) {
        console.error("❌ No business found — run seedBusiness first.");
        return;
    }
    // 👇 FIND FIRST (no unique constraint required)
    let client = await prisma.client.findFirst({
        where: { businessId: business.id, firstName: "Seed", lastName: "Client" },
    });
    // 👇 If not found → CREATE
    if (!client) {
        client = await prisma.client.create({
            data: {
                businessId: business.id,
                firstName: "Seed",
                lastName: "Client",
                email: "seedclient@flowtradie.com",
                type: ClientType.RESIDENTIAL,
            },
        });
    }
    console.log("👤 Seed Client:", client.id);
    return client;
}
//# sourceMappingURL=seedClient.js.map