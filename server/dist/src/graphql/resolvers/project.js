// server/src/graphql/resolvers/project.ts
import { projectService } from "../../services/project.service.js";
export const projectResolvers = {
    /* ============================================================
       QUERY
    ============================================================ */
    Query: {
        projects: async (_parent, _args, ctx) => {
            return projectService.getAll(ctx);
        },
        project: async (_parent, args, ctx) => {
            return projectService.getById(args.id, ctx);
        },
    },
    /* ============================================================
       MUTATION
    ============================================================ */
    Mutation: {
        createProject: async (_parent, { input }, ctx) => projectService.create(input, ctx),
        updateProject: async (_parent, { id, input }, ctx) => projectService.update(id, input, ctx),
        deleteProject: async (_parent, { id }, ctx) => projectService.delete(id, ctx),
    },
    /* ============================================================
       FIELD RESOLVERS
    ============================================================ */
    Project: {
        // ⚡️ PERFORMANCE FIX: Check if parent already has the data before fetching
        client: (parent, _args, ctx) => parent.client ?? projectService.getClient(parent.id, ctx),
        quotes: (parent, _args, ctx) => parent.quotes ?? projectService.getQuotes(parent.id, ctx),
        invoices: (parent, _args, ctx) => parent.invoices ?? projectService.getInvoices(parent.id, ctx),
        tasks: (parent, _args, ctx) => parent.tasks ?? projectService.getTasks(parent.id, ctx),
        expenses: (parent, _args, ctx) => parent.expenses ?? projectService.getExpenses(parent.id, ctx),
        timeLogs: (parent, _args, ctx) => parent.timeLogs ?? projectService.getTimeLogs(parent.id, ctx),
        financialSummary: async (parent, _args, ctx) => {
            const summary = await projectService.getFinancialSummary(parent.id, ctx);
            return {
                invoicesTotal: Number(summary.invoicesTotal),
                paymentsTotal: Number(summary.paymentsTotal),
                expensesTotal: Number(summary.expensesTotal),
                hoursWorked: Number(summary.hoursWorked),
                estimatedProfit: Number(summary.estimatedProfit),
            };
        },
        isOverdue: (parent) => {
            if (!parent.endDate)
                return false;
            return new Date(parent.endDate) < new Date();
        },
        progress: (parent) => {
            if (!parent.tasks || parent.tasks.length === 0)
                return 0;
            const completed = parent.tasks.filter((t) => t.status === "COMPLETED" || t.isCompleted).length;
            return (completed / parent.tasks.length) * 100;
        },
        totalHoursWorked: (parent) => parent.timeLogs?.reduce((sum, log) => sum + Number(log.hoursWorked), 0) ?? 0,
    },
};
//# sourceMappingURL=project.js.map