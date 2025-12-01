import { GraphQLContext } from "../context.js";
import { Prisma } from "@prisma/client";

// Define the Prisma select object for a "safe" user once.
const selectSafeUser = {
  id: true,
  email: true,
  name: true,
  role: true,
  phone: true,
  businessId: true,
  hourlyRate: true,
  createdAt: true,
  updatedAt: true,
};

export const userService = {
  // 🔒 SECURED: Only return users from the current business
  getAll: (ctx: GraphQLContext) => {
    if (!ctx.businessId) return []; // Safety check

    return ctx.prisma.user.findMany({
      where: {
        deletedAt: null,
        businessId: ctx.businessId, // 🔥 ADDED
      },
      orderBy: { createdAt: "desc" },
      select: selectSafeUser,
    });
  },

  // 🔒 SECURED: Only return user if they match the ID AND the Business ID
  getById: (id: string, ctx: GraphQLContext) => {
    if (!ctx.businessId) return null;

    return ctx.prisma.user.findFirst({
      where: {
        id,
        businessId: ctx.businessId, // 🔥 ADDED
        deletedAt: null,
      },
      select: selectSafeUser,
    });
  },

  getMe: async (ctx: GraphQLContext) => {
    if (!ctx.user?.id) {
      throw new Error("Unauthorized");
    }

    return ctx.prisma.user.findFirst({
      where: { id: ctx.user.id, deletedAt: null },
      select: selectSafeUser,
    });
  },

  // 🔒 SECURED: Prevent deleting users from other businesses
  delete: async (id: string, ctx: GraphQLContext) => {
    if (!ctx.businessId) throw new Error("Unauthorized");

    // 1. Verify user belongs to business before deleting
    const userToDelete = await ctx.prisma.user.findFirst({
      where: { id, businessId: ctx.businessId },
    });

    if (!userToDelete) {
      throw new Error("User not found or access denied");
    }

    // 2. Perform Soft Delete
    return ctx.prisma.user.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  },
};