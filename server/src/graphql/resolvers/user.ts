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
          // password excluded ✅
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
          // password excluded ✅
        },
      }) as Promise<SafeUser | null>;
    },
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
