// server/src/services/user.service.ts
import { GraphQLContext } from "../context.js";
import { Prisma } from "@prisma/client"; // Import Prisma for types

// Define the Prisma select object for a "safe" user once.
const selectSafeUser = {
  id: true,
  email: true,
  name: true,
  role: true,
  phone: true,
  hourlyRate: true,
  createdAt: true,
  updatedAt: true,
};

export const userService = {
  getAll: (ctx: GraphQLContext) => {
    return ctx.prisma.user.findMany({
      where: { deletedAt: null }, // <-- CHANGED
      orderBy: { createdAt: "desc" },
      select: selectSafeUser,
    });
  },

  getById: (id: string, ctx: GraphQLContext) => {
    // CHANGED: Use findFirst to ensure we don't fetch a deleted user
    return ctx.prisma.user.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      select: selectSafeUser,
    });
  },

  getMe: (ctx: GraphQLContext) => {
    if (!ctx.user) {
      return null;
    }
    // CHANGED: Use findFirst to ensure the logged-in user hasn't been soft-deleted
    return ctx.prisma.user.findFirst({
      where: {
        id: ctx.user.id,
        deletedAt: null,
      },
      select: selectSafeUser,
    });
  },

  // vvvvvvvv NEW DELETE FUNCTION ADDED vvvvvvvv
  delete: (id: string, ctx: GraphQLContext) => {
    return ctx.prisma.user.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  },
  // ^^^^^^^^^^ NEW DELETE FUNCTION ADDED ^^^^^^^^^^
};