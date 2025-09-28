// src/services/user.service.ts
import { PrismaClient, UserRole } from "@prisma/client";
import { requireRole } from "../middleware/permissions.js";
const prisma = new PrismaClient();
export const userService = {
    async getAllUsers({ prisma, user }) {
        requireRole(user, [UserRole.OWNER, UserRole.ADMIN]);
        return prisma.user.findMany({
            orderBy: { createdAt: "desc" },
        });
    },
    async getUserById(id, { prisma, user }) {
        requireRole(user, [UserRole.OWNER, UserRole.ADMIN, UserRole.MANAGER]);
        return prisma.user.findUnique({ where: { id } });
    },
    // 🚫 Prevent direct user creation here
    async createUser(_input, _ctx) {
        throw new Error("Please use the 'register' mutation from auth.service.ts to create users with a password.");
    },
    async updateUser(id, input, { prisma, user }) {
        requireRole(user, [UserRole.OWNER, UserRole.ADMIN]);
        return prisma.user.update({
            where: { id },
            data: input,
        });
    },
    async deleteUser(id, { prisma, user }) {
        requireRole(user, [UserRole.OWNER]);
        return prisma.user.delete({ where: { id } });
    },
    async getUserTasks(userId, { prisma }) {
        return prisma.task.findMany({ where: { assignedToId: userId } });
    },
};
//# sourceMappingURL=user.service.js.map