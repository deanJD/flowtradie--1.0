import { hashPassword, verifyPassword } from "../utils/password.js";
import { signToken } from "../utils/jwt.js";
import { UserRole } from "@prisma/client";
// The local 'prisma' instance has been removed. We will use the one from the context.
export const authService = {
    // 🔹 Register a new user
    async register(input, ctx) {
        const { name, email, password } = input;
        // CHANGED: Only check for an existing *active* user.
        // This allows a deleted user to re-register with the same email.
        const existing = await ctx.prisma.user.findFirst({
            where: { email, deletedAt: null },
        });
        if (existing) {
            throw new Error("Email already in use.");
        }
        // This logic is brilliant and remains the same. It correctly counts all users.
        const userCount = await ctx.prisma.user.count();
        const role = userCount === 0 ? UserRole.OWNER : UserRole.WORKER;
        const hashedPassword = await hashPassword(password);
        return ctx.prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role,
            },
        });
    },
    // 🔹 Login
    async login(input, ctx) {
        const { email, password } = input;
        // CHANGED: This is the critical security fix.
        // Only find a user if their account has NOT been soft-deleted.
        const user = await ctx.prisma.user.findFirst({
            where: {
                email,
                deletedAt: null,
            },
        });
        if (!user)
            throw new Error("Invalid credentials");
        const valid = await verifyPassword(password, user.password);
        if (!valid)
            throw new Error("Invalid credentials");
        const token = signToken({ id: user.id, role: user.role });
        // This now returns the full AuthPayload, as the schema requires.
        return {
            token,
            user,
        };
    },
};
//# sourceMappingURL=auth.service.js.map