// server/src/graphql/resolvers/project.ts

import {
  QueryProjectArgs,
  MutationCreateProjectArgs,
  MutationUpdateProjectArgs,
  MutationDeleteProjectArgs,
  Project as GqlProject,
} from "@/__generated__/graphql.js";

import { GraphQLContext } from "../../context.js";
import { projectService } from "../../services/project.service.js";

export const projectResolvers = {
  /* ============================================================
     QUERY
  ============================================================ */
  Query: {
    projects: async (_parent: unknown, _args: unknown, ctx: GraphQLContext) => {
      return projectService.getAll(ctx);
    },

    project: async (_parent: unknown, args: QueryProjectArgs, ctx: GraphQLContext) => {
      return projectService.getById(args.id, ctx);
    },
  },

  /* ============================================================
     MUTATION
  ============================================================ */
  Mutation: {
    createProject: async (
      _parent: unknown,
      { input }: MutationCreateProjectArgs,
      ctx: GraphQLContext
    ) => projectService.create(input, ctx),

    updateProject: async (
      _parent: unknown,
      { id, input }: MutationUpdateProjectArgs,
      ctx: GraphQLContext
    ) => projectService.update(id, input, ctx),

    deleteProject: async (
      _parent: unknown,
      { id }: MutationDeleteProjectArgs,
      ctx: GraphQLContext
    ) => projectService.delete(id, ctx),
  },

  /* ============================================================
     FIELD RESOLVERS
  ============================================================ */
  Project: {
    // 🏠 Site address
    siteAddress: async (parent: GqlProject, _args: unknown, ctx: GraphQLContext) => {
      // if the service already included siteAddress, just return it
      const anyParent = parent as any;
      if (anyParent.siteAddress) {
        return anyParent.siteAddress;
      }

      // otherwise, fetch it via Prisma
      const project = await ctx.prisma.project.findUnique({
        where: { id: parent.id },
        include: { siteAddress: true },
      });

      return project?.siteAddress ?? null;
    },

    // ⚡️ PERFORMANCE FIX: Check if parent already has the data before fetching
    client: (parent: GqlProject, _args: unknown, ctx: GraphQLContext) =>
      (parent as any).client ?? projectService.getClient(parent.id, ctx),

    quotes: (parent: GqlProject, _args: unknown, ctx: GraphQLContext) =>
      (parent as any).quotes ?? projectService.getQuotes(parent.id, ctx),

    invoices: (parent: GqlProject, _args: unknown, ctx: GraphQLContext) =>
      (parent as any).invoices ?? projectService.getInvoices(parent.id, ctx),

    tasks: (parent: GqlProject, _args: unknown, ctx: GraphQLContext) =>
      (parent as any).tasks ?? projectService.getTasks(parent.id, ctx),

    expenses: (parent: GqlProject, _args: unknown, ctx: GraphQLContext) =>
      (parent as any).expenses ?? projectService.getExpenses(parent.id, ctx),

    timeLogs: (parent: GqlProject, _args: unknown, ctx: GraphQLContext) =>
      (parent as any).timeLogs ?? projectService.getTimeLogs(parent.id, ctx),

    financialSummary: async (parent: GqlProject, _args: unknown, ctx: GraphQLContext) => {
      const summary = await projectService.getFinancialSummary(parent.id, ctx);

      return {
        invoicesTotal: Number(summary.invoicesTotal),
        paymentsTotal: Number(summary.paymentsTotal),
        expensesTotal: Number(summary.expensesTotal),
        hoursWorked: Number(summary.hoursWorked),
        estimatedProfit: Number(summary.estimatedProfit),
      };
    },

    isOverdue: (parent: GqlProject) => {
      if (!parent.endDate) return false;
      return new Date(parent.endDate) < new Date();
    },

    progress: (parent: GqlProject) => {
      const anyParent = parent as any;
      if (!anyParent.tasks || anyParent.tasks.length === 0) return 0;
      const completed = anyParent.tasks.filter(
        (t: any) => t.status === "COMPLETED" || t.isCompleted
      ).length;
      return (completed / anyParent.tasks.length) * 100;
    },

    totalHoursWorked: (parent: GqlProject) => {
      const anyParent = parent as any;
      return (
        anyParent.timeLogs?.reduce(
          (sum: number, log: any) => sum + Number(log.hoursWorked),
          0
        ) ?? 0
      );
    },
  },
};
