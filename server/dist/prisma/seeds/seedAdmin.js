import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();
export default async function seedAdmin(prisma) {
    console.log("🌱 Seeding Owner User...");
    const business = await prisma.business.findFirst();
    if (!business) {
        console.error("❌ No business found — run seedBusiness first");
        return;
    }
    const hashedPassword = await bcrypt.hash("password123", 10);
    const owner = await prisma.user.upsert({
        where: { email: "owner@flowtradie.com" },
        update: {
            password: hashedPassword,
            role: "OWNER",
            businessId: business.id,
        },
        create: {
            email: "owner@flowtradie.com",
            password: hashedPassword,
            name: "Dean (Owner)",
            role: "OWNER",
            businessId: business.id,
        },
    });
    console.log("   ➤ Owner user seeded:", owner.id);
}
//# sourceMappingURL=seedAdmin.js.map