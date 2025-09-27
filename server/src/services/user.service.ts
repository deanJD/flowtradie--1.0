// src/services/user.service.ts
import { PrismaClient, UserRole, User, Task } from "@prisma/client";
import { GraphQLContext } from "../context.js";
import { requireRole } from "../middleware/permissions.js";

const prisma = new PrismaClient();

interface CreateUserInput {
  email: string;
  name: string;
  role?: UserRole;
  phone?: string;
  hourlyRate?: number;
}

interface UpdateUserInput {
  email?: string;
  name?: string;
  role?: UserRole;
  phone?: string;
  hourlyRate?: number;
}

export const userService = {
  async getAllUsers({ prisma, user }: GraphQLContext): Promise<User[]> {
    requireRole(user, [UserRole.OWNER, UserRole.ADMIN]);
    return prisma.user.findMany({
      orderBy: { createdAt: "desc" },
    });
  },

  async getUserById(id: string, { prisma, user }: GraphQLContext): Promise<User | null> {
    requireRole(user, [UserRole.OWNER, UserRole.ADMIN, UserRole.MANAGER]);
    return prisma.user.findUnique({ where: { id } });
  },

  // 🚫 Prevent direct user creation here
  async createUser(_input: CreateUserInput, _ctx: GraphQLContext): Promise<never> {
    throw new Error(
      "Please use the 'register' mutation from auth.service.ts to create users with a password."
    );
  },

  async updateUser(id: string, input: UpdateUserInput, { prisma, user }: GraphQLContext): Promise<User> {
    requireRole(user, [UserRole.OWNER, UserRole.ADMIN]);
    return prisma.user.update({
      where: { id },
      data: input,
    });
  },

  async deleteUser(id: string, { prisma, user }: GraphQLContext): Promise<User> {
    requireRole(user, [UserRole.OWNER]);
    return prisma.user.delete({ where: { id } });
  },

  async getUserTasks(userId: string, { prisma }: GraphQLContext): Promise<Task[]> {
    return prisma.task.findMany({ where: { assignedToId: userId } });
  },
};
