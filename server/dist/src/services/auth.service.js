// server/src/services/auth.service.ts
import { PrismaClient } from "@prisma/client";
import { encodeToken } from "../utils/jwt.js";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();
export const authService = {
    // ---------------- SIGN-UP ----------------
    async register(input) {
        const { name, email, password, regionCode } = input;
        // 1) Find Region (Critical for Tax Rules)
        const region = await prisma.region.findUnique({
            where: { code: regionCode },
        });
        if (!region)
            throw new Error(`Invalid region: ${regionCode}`);
        // 2) Run in Transaction (Safety First)
        // We want to ensure User, Business, AND Settings are created together.
        const result = await prisma.$transaction(async (tx) => {
            // A. Create Business
            const business = await tx.business.create({
                data: {
                    name, // Default business name to user's name initially
                    email,
                    legalName: name,
                    region: { connect: { id: region.id } },
                },
            });
            // B. 👇 SMART SETTINGS CREATION
            // This is the "Xero-like" magic. We pre-fill tax rules based on the region.
            await tx.invoiceSettings.create({
                data: {
                    businessId: business.id,
                    invoicePrefix: "INV-",
                    startingNumber: 1000,
                    defaultDueDays: 14,
                    // Inherit defaults from the Region
                    taxRate: region.defaultTaxRate,
                    taxLabel: region.taxLabel,
                },
            });
            // C. Create User
            const hashed = await bcrypt.hash(password, 10);
            const user = await tx.user.create({
                data: {
                    email,
                    password: hashed,
                    name,
                    role: "OWNER",
                    businessId: business.id,
                },
            });
            return { user, business };
        });
        // 3) Generate Token
        const token = encodeToken({
            id: result.user.id,
            role: result.user.role,
            businessId: result.business.id,
        });
        return { token, user: result.user };
    },
    // ---------------- SIGN-IN ----------------
    async login(input) {
        const { email, password } = input;
        const user = await prisma.user.findUnique({
            where: { email },
        });
        if (!user)
            throw new Error("Invalid credentials");
        const ok = await bcrypt.compare(password, user.password);
        if (!ok)
            throw new Error("Invalid credentials");
        const token = encodeToken({
            id: user.id,
            role: user.role,
            businessId: user.businessId,
        });
        return { token, user };
    },
};
//# sourceMappingURL=auth.service.js.map