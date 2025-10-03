// src/graphql/resolvers/user.ts
import type { User, Task } from "@prisma/client";
import { GraphQLContext } from "../../context.js";

// ✅ Create a "SafeUser" type that excludes the password field
export type SafeUser = Omit<User, "password">;

export const userResolvers = {
  Query: {
    users: (
      _p: unknown,
      _a: unknown,
      ctx: GraphQLContext
    ): Promise<SafeUser[]> => {
      return ctx.prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          phone: true,
          hourlyRate: true,
          createdAt: true,
          updatedAt: true,
        },
      }) as Promise<SafeUser[]>;
    },

    user: (
      _p: unknown,
      args: { id: string },
      ctx: GraphQLContext
    ): Promise<SafeUser | null> => {
      return ctx.prisma.user.findUnique({
        where: { id: args.id },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          phone: true,
          hourlyRate: true,
          createdAt: true,
          updatedAt: true,
        },
      }) as Promise<SafeUser | null>;
    },

    // vvvvvvvvvv NEW RESOLVER ADDED BELOW vvvvvvvvvv
    me: async (
      _p: unknown,
      _a: unknown,
      ctx: GraphQLContext
    ): Promise<SafeUser | null> => {
      // If the context doesn't have a user, they're not logged in.
      if (!ctx.user) {
        return null;
      }
      // Fetch the current user from the database using the ID from the context.
      return (await ctx.prisma.user.findUnique({
        where: { id: ctx.user.id },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          phone: true,
          hourlyRate: true,
          createdAt: true,
          updatedAt: true,
        },
      })) as SafeUser | null;
    },
    // ^^^^^^^^^^ NEW RESOLVER ADDED ABOVE ^^^^^^^^^^
  },

  User: {
    tasks: (
      parent: User,
      _a: unknown,
      ctx: GraphQLContext
    ): Promise<Task[]> => {
      return ctx.prisma.task.findMany({
        where: { assignedToId: parent.id },
      });
    },
  },
};