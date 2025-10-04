// server/src/graphql/resolvers/reporting.ts
import { GraphQLContext } from '../../context.js';
import { reportingService } from '../../services/reporting.service.js';

export const reportingResolvers = {
  Query: {
    jobProfitability: (
      _parent: unknown,
      { jobId }: { jobId: string },
      ctx: GraphQLContext
    ) => {
      return reportingService.jobProfitability(jobId, ctx);
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