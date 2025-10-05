import { reportingService } from '../../services/reporting.service.js';
export const reportingResolvers = {
    Query: {
        projectProfitability: (_parent, { projectId }, ctx) => {
            return reportingService.projectProfitability(projectId, ctx);
        },
        getDashboardSummary: (_parent, _args, ctx) => {
            return reportingService.getDashboardSummary(ctx);
        },
    },
};
//# sourceMappingURL=reporting.js.map