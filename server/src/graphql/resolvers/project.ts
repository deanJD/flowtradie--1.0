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
    client: (parent: GqlProject, _args: unknown, ctx: GraphQLContext) =>
      parent.client ?? projectService.getClient(parent.id, ctx),

    quotes: (parent: GqlProject, _args: unknown, ctx: GraphQLContext) =>
      projectService.getQuotes(parent.id, ctx),

    invoices: (parent: GqlProject, _args: unknown, ctx: GraphQLContext) =>
      projectService.getInvoices(parent.id, ctx),

    tasks: (parent: GqlProject, _args: unknown, ctx: GraphQLContext) =>
      projectService.getTasks(parent.id, ctx),

    expenses: (parent: GqlProject, _args: unknown, ctx: GraphQLContext) =>
      projectService.getExpenses(parent.id, ctx),

    timeLogs: (parent: GqlProject, _args: unknown, ctx: GraphQLContext) =>
      projectService.getTimeLogs(parent.id, ctx),

    financialSummary: async (parent: GqlProject, _args: unknown, ctx: GraphQLContext) => {
      const summary = await projectService.getFinancialSummary(parent.id, ctx);

      // Convert Decimal → number to satisfy GraphQL codegen types
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
      if (!parent.tasks || parent.tasks.length === 0) return 0;
      const completed = parent.tasks.filter(t => t.status === "COMPLETED").length;
      return (completed / parent.tasks.length) * 100;
    },

    totalHoursWorked: (parent: GqlProject) =>
      parent.timeLogs?.reduce((sum, log) => sum + Number(log.hoursWorked), 0) ?? 0,
  },
};
