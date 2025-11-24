// prisma/seeds/seedAdmin.ts
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs"; // <-- ADD THIS!
const prisma = new PrismaClient();
export default async function seedAdmin() {
    console.log("🌱 Seeding Owner User...");
    // 1) Get THE business (first one)
    const business = await prisma.business.findFirst();
    if (!business) {
        console.error("❌ No business found — run seedBusiness first");
        return;
    }
    // 2) HASH PASSWORD BEFORE SEEDING
    const hashedPassword = await bcrypt.hash("password123", 10); // <--- IMPORTANT
    // 3) Create / update ADMIN
    const owner = await prisma.user.upsert({
        where: { email: "owner@flowtradie.com" },
        update: {},
        create: {
            email: "owner@flowtradie.com",
            password: hashedPassword, // <--- USE HASHED HERE
            name: "Dean (Owner)",
            role: "OWNER",
            business: { connect: { id: business.id } }, // <--- WORKS
        },
    });
    console.log("   ➤ Owner user seeded:", owner.id);
}
//# sourceMappingURL=seedAdmin.js.map