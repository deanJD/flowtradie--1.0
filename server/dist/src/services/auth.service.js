// src/services/auth.service.ts
import { PrismaClient, UserRole } from "@prisma/client";
import { hashPassword, verifyPassword } from "../utils/password.js";
import { signToken } from "../utils/jwt.js";
const prisma = new PrismaClient();
export const authService = {
    // 🔹 Register a new user
    async register({ name, email, password }) {
        // check if user already exists
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            throw new Error("Email already in use.");
        }
        // bootstrap OWNER role if this is the first user
        const userCount = await prisma.user.count();
        const role = userCount === 0 ? UserRole.OWNER : UserRole.WORKER;
        // hash password
        const hashedPassword = await hashPassword(password);
        // create user
        return prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role,
            },
        });
    },
    // 🔹 Login
    async login({ email, password }) {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user)
            throw new Error("Invalid credentials");
        const valid = await verifyPassword(password, user.password);
        if (!valid)
            throw new Error("Invalid credentials");
        // sign JWT
        return signToken({ id: user.id, role: user.role });
    },
};
//# sourceMappingURL=auth.service.js.map