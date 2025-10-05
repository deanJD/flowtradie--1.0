// server/src/graphql/resolvers/reporting.ts
import { GraphQLContext } from '../../context.js';
import { reportingService } from '../../services/reporting.service.js';

export const reportingResolvers = {
  Query: {
    projectProfitability: (
      _parent: unknown,
      { projectId }: { projectId: string },
      ctx: GraphQLContext
    ) => {
      return reportingService.projectProfitability(projectId, ctx);
    },

    getDashboardSummary: (
      _parent: unknown,
      _args: unknown,
      ctx: GraphQLContext
    ) => {
      return reportingService.getDashboardSummary(ctx);
    },
  },
};