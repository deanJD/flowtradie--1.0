// server/src/graphql/resolvers/user.ts
import type { User, Task } from "@prisma/client";
import { GraphQLContext } from "../../context.js";
import { userService } from "../../services/user.service.js"; // <-- Import the new service

export const userResolvers = {
  Query: {
    // These now just call the service
    users: (_p: unknown, _a: unknown, ctx: GraphQLContext) =>
      userService.getAll(ctx),

    user: (_p: unknown, { id }: { id: string }, ctx: GraphQLContext) =>
      userService.getById(id, ctx),

    me: (_p: unknown, _a: unknown, ctx: GraphQLContext) =>
      userService.getMe(ctx),
  },

  // This relational resolver is still correct
  User: {
    tasks: (parent: User, _a: unknown, ctx: GraphQLContext): Promise<Task[]> => {
      return ctx.prisma.task.findMany({
        where: { assignedToId: parent.id },
      });
    },
  },
};