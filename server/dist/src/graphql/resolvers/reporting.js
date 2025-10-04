import { reportingService } from '../../services/reporting.service.js';
export const reportingResolvers = {
    Query: {
        jobProfitability: (_parent, { jobId }, ctx) => {
            return reportingService.jobProfitability(jobId, ctx);
        },
        getDashboardSummary: (_parent, _args, ctx) => {
            return reportingService.getDashboardSummary(ctx);
        },
    },
};
//# sourceMappingURL=reporting.js.map