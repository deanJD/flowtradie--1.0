// server/src/graphql/resolvers/timelog.ts

import { GraphQLContext } from "../../context.js";
import { timeLogService } from "../../services/timelog.service.js";
import { CreateTimeLogInput, UpdateTimeLogInput } from "@/__generated__/graphql.js";

export const timeLogResolvers = {
  Query: {
    timeLogsForProject: (
      _p: unknown,
      { projectId }: { projectId: string },
      ctx: GraphQLContext
    ) => timeLogService.getAllByProject(projectId, ctx),

    timeLogsForUser: (
      _p: unknown,
      { userId }: { userId: string },
      ctx: GraphQLContext
    ) => timeLogService.getAllByUser(userId, ctx),
  },
  Mutation: {
    createTimeLog: (
      _p: unknown,
      { input }: { input: CreateTimeLogInput },
      ctx: GraphQLContext
    ) => timeLogService.create(input, ctx),

    updateTimeLog: (
      _p: unknown,
      { id, input }: { id: string; input: UpdateTimeLogInput },
      ctx: GraphQLContext
    ) => timeLogService.update(id, input, ctx),

    deleteTimeLog: (
      _p: unknown,
      { id }: { id: string },
      ctx: GraphQLContext
    ) => timeLogService.delete(id, ctx),
  },

  // Note: The relational resolvers for `TimeLog.project` and `TimeLog.user`
  // are no longer needed because our new service functions automatically
  // include that data.
};