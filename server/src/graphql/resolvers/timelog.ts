// src/graphql/resolvers/timelog.ts
import { GraphQLContext } from "../../context.js";
import * as timeLogService from "../../services/timelog.service.js";

import {
  QueryTimeLogArgs,
  MutationCreateTimeLogArgs,
  MutationUpdateTimeLogArgs,
  MutationDeleteTimeLogArgs,
  TimeLog as GQLTimeLog,
} from "@/__generated__/graphql.js";

export const timeLogResolvers = {
  Query: {
    // Get all time logs for THIS BUSINESS
    timeLogs: async (_p: unknown, _args: unknown, ctx: GraphQLContext): Promise<GQLTimeLog[]> => {
      return (await timeLogService.getAll(ctx)) as unknown as GQLTimeLog[];
    },

    // Get single timelog by ID
    timeLog: async (_p: unknown, { id }: QueryTimeLogArgs, ctx: GraphQLContext) => {
      return (await timeLogService.getById(id, ctx)) as unknown as GQLTimeLog | null;
    },
  },

  Mutation: {
    createTimeLog: async (
      _p: unknown,
      { input }: MutationCreateTimeLogArgs,
      ctx: GraphQLContext
    ): Promise<GQLTimeLog> => {
      return (await timeLogService.create(input, ctx)) as unknown as GQLTimeLog;
    },

    updateTimeLog: async (
      _p: unknown,
      { id, input }: MutationUpdateTimeLogArgs,
      ctx: GraphQLContext
    ): Promise<GQLTimeLog> => {
      return (await timeLogService.update(id, input, ctx)) as unknown as GQLTimeLog;
    },

    deleteTimeLog: async (
      _p: unknown,
      { id }: MutationDeleteTimeLogArgs,
      ctx: GraphQLContext
    ): Promise<GQLTimeLog> => {
      return (await timeLogService.remove(id, ctx)) as unknown as GQLTimeLog;
    },
  },
};
