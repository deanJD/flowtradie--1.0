// prisma/seeds/seedAdmin.ts
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export default async function seedAdmin() {
    console.log("🌱 Seeding Owner User...");
    // 1) Find Business
    const business = await prisma.business.findFirst({
        where: { email: "contact@flowtradie.com" },
    });
    if (!business) {
        console.error("❌ Business not found. Run seedBusiness first.");
        return;
    }
    // 2) Create or update the admin user
    const owner = await prisma.user.upsert({
        where: { email: "owner@flowtradie.com" },
        update: {},
        create: {
            businessId: business.id,
            email: "owner@flowtradie.com",
            // ⚠ Password is plain text for now — you will hash later.
            password: "password123",
            name: "Dean (Owner)",
            role: "OWNER",
            phone: "0400 000 000",
            hourlyRate: 0,
        },
    });
    console.log("   ➤ Owner user seeded:", owner.id);
}
//# sourceMappingURL=seedAdmin.js.map