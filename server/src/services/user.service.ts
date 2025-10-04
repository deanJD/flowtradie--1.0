// server/src/services/user.service.ts
import { GraphQLContext } from "../context.js";

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
      orderBy: { createdAt: "desc" },
      select: selectSafeUser,
    });
  },

  getById: (id: string, ctx: GraphQLContext) => {
    return ctx.prisma.user.findUnique({
      where: { id },
      select: selectSafeUser,
    });
  },

  getMe: (ctx: GraphQLContext) => {
    // If the context doesn't have a user from the token, return null.
    if (!ctx.user) {
      return null;
    }
    // Otherwise, fetch that user's safe data.
    return ctx.prisma.user.findUnique({
      where: { id: ctx.user.id },
      select: selectSafeUser,
    });
  },
};