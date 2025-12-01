// server/prisma/seeds/seedAdmin.ts
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();

export default async function seedAdmin() {
  console.log("🌱 Seeding Owner User...");

  // 1) Get THE business (first one)
  const business = await prisma.business.findFirst();
  if (!business) {
    console.error("❌ No business found — run seedBusiness first");
    return;
  }

  // 2) HASH PASSWORD
  const hashedPassword = await bcrypt.hash("password123", 10);

  // 3) Create / update ADMIN
  const owner = await prisma.user.upsert({
    where: { email: "owner@flowtradie.com" },
    // 🔥 FIX: Actually update the user if they exist!
    update: {
      password: hashedPassword,             // Reset password ensures seed password always works
      role: "OWNER",
      business: { connect: { id: business.id } }, // <--- FORCE RE-LINK BUSINESS
    },
    create: {
      email: "owner@flowtradie.com",
      password: hashedPassword,
      name: "Dean (Owner)",
      role: "OWNER",
      business: { connect: { id: business.id } },
    },
  });

  console.log("   ➤ Owner user seeded:", owner.id);
}