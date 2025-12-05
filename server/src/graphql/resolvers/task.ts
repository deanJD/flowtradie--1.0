// server/src/graphql/resolvers/task.ts

import { GraphQLContext } from "../../context.js";
import {
  QueryTaskArgs,
  MutationCreateTaskArgs,
  MutationUpdateTaskArgs,
} from "@/__generated__/graphql.js";
import { taskService } from "../../services/task.service.js";

export const taskResolvers = {
  Query: {
    // ⛳ NO ARGUMENTS ANYMORE
    tasks: async (_p: unknown, _args: unknown, ctx: GraphQLContext) => {
      return taskService.getAll(ctx);  // returns tasks for the logged-in business
    },

    task: async (_p: unknown, args: QueryTaskArgs, ctx: GraphQLContext) => {
      return taskService.getById(args.id, ctx);
    },
  },

  Mutation: {
    createTask: async (
      _p: unknown,
      { input }: MutationCreateTaskArgs,
      ctx: GraphQLContext
    ) => {
      return taskService.create(input, ctx);
    },

    updateTask: async (
      _p: unknown,
      { id, input }: MutationUpdateTaskArgs,
      ctx: GraphQLContext
    ) => {
      return taskService.update(id, input, ctx);
    },

    deleteTask: async (
      _p: unknown,
      { id }: { id: string },
      ctx: GraphQLContext
    ) => {
      return taskService.delete(id, ctx);
    },
  },
};
