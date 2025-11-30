// server/src/graphql/resolvers/project.ts
import { projectService } from "../../services/project.service.js";
export const projectResolvers = {
    // -----------------------
    // 🔍 QUERY
    // -----------------------
    Query: {
        projects: async (_parent, _args, ctx) => {
            return projectService.getAll(undefined, ctx);
        },
        project: async (_parent, { id }, ctx) => {
            return projectService.getById(id, ctx);
        },
    },
    // -----------------------
    // 🛠 MUTATION
    // -----------------------
    Mutation: {
        createProject: async (_parent, { input }, ctx) => {
            return projectService.create(input, ctx);
        },
        updateProject: async (_parent, { id, input }, ctx) => {
            const { user } = ctx;
            if (!user)
                throw new Error("You must be logged in to update a project.");
            if (input.budgetedAmount !== undefined && !["OWNER", "ADMIN"].includes(user.role)) {
                throw new Error("You are not authorized to edit the project budget.");
            }
            return projectService.update(id, input, ctx);
        },
        deleteProject: async (_parent, { id }, ctx) => {
            return projectService.delete(id, ctx);
        },
    },
    // -----------------------
    // 🔗 RELATIONS
    // -----------------------
    Project: {
        client: (parent, _args, ctx) => {
            return projectService.getClient(parent.id, ctx);
        },
        invoices: (parent, _args, ctx) => {
            return projectService.getInvoices(parent.id, ctx);
        },
        quotes: (parent, _args, ctx) => {
            return projectService.getQuotes(parent.id, ctx);
        },
        tasks: (parent, _args, ctx) => {
            return projectService.getTasks(parent.id, ctx);
        },
        expenses: (parent, _args, ctx) => {
            return projectService.getExpenses(parent.id, ctx);
        },
        timeLogs: (parent, _args, ctx) => {
            return projectService.getTimeLogs(parent.id, ctx);
        },
        // -----------------------
        // 🧮 REPORTING (NEW)
        // -----------------------
        financialSummary: (parent, _args, ctx) => {
            return projectService.getFinancialSummary(parent.id, ctx);
        },
        isOverdue: (parent) => {
            if (!parent.endDate)
                return false;
            return new Date(parent.endDate) < new Date();
        },
        progress: async (parent, _args, ctx) => {
            const tasks = await ctx.prisma.task.findMany({
                where: { projectId: parent.id, deletedAt: null },
            });
            if (!tasks.length)
                return 0;
            const done = tasks.filter((t) => t.isCompleted).length;
            return done / tasks.length;
        },
        totalHoursWorked: async (parent, _args, ctx) => {
            const result = await ctx.prisma.timeLog.aggregate({
                where: { projectId: parent.id, deletedAt: null },
                _sum: { hoursWorked: true },
            });
            const hours = result._sum.hoursWorked;
            return hours ? Number(hours) : 0;
        },
    },
};
//# sourceMappingURL=project.js.map