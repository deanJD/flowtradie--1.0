// server/src/graphql/resolvers/task.ts

import { GraphQLContext } from "../../context.js";
import {
  Resolvers,
  QueryTaskArgs,
  MutationCreateTaskArgs,
  MutationUpdateTaskArgs,
} from "@/__generated__/graphql.js";
import { taskService } from "../../services/task.service.js";

export const taskResolvers: Resolvers = {
  Query: {
    // ⛳ NO ARGUMENTS ANYMORE
    tasks: async (_p, _args: unknown, ctx: GraphQLContext) => {
      return (await taskService.getAll(ctx)) as any;  // get all tasks for business
    },

    task: async (_p, args: QueryTaskArgs, ctx: GraphQLContext) => {
      return (await taskService.getById(args.id, ctx)) as any;
    },
  },

  Mutation: {
    createTask: async (_p, { input }: MutationCreateTaskArgs, ctx: GraphQLContext) => {
      return (await taskService.create(input, ctx)) as any;
    },

    updateTask: async (_p, { id, input }: MutationUpdateTaskArgs, ctx: GraphQLContext) => {
      return (await taskService.update(id, input, ctx)) as any;
    },

    deleteTask: async (_p, { id }: { id: string }, ctx: GraphQLContext) => {
      return (await taskService.delete(id, ctx)) as any;
    },
  },
};
