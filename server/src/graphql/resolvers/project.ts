// server/src/graphql/resolvers/project.ts

import { GraphQLContext } from "../../context.js";
import { projectService } from "../../services/project.service.js";
import {
  QueryProjectArgs,
  MutationCreateProjectArgs,
  MutationUpdateProjectArgs,
  MutationDeleteProjectArgs,
} from "@/__generated__/graphql.js";

export const projectResolvers = {
  // -----------------------
  // 🔍 QUERY
  // -----------------------
  Query: {
    projects: async (
      _parent: unknown,
      _args: unknown,
      ctx: GraphQLContext
    ): Promise<any[]> => {
      return projectService.getAll(undefined, ctx);
    },

    project: async (
      _parent: unknown,
      { id }: QueryProjectArgs,
      ctx: GraphQLContext
    ): Promise<any | null> => {
      return projectService.getById(id, ctx);
    },
  },

  // -----------------------
  // 🛠 MUTATION
  // -----------------------
  Mutation: {
    createProject: async (
      _parent: unknown,
      { input }: MutationCreateProjectArgs,
      ctx: GraphQLContext
    ): Promise<any> => {
      return projectService.create(input, ctx);
    },

    updateProject: async (
      _parent: unknown,
      { id, input }: MutationUpdateProjectArgs,
      ctx: GraphQLContext
    ): Promise<any> => {
      const { user } = ctx;
      if (!user) throw new Error("You must be logged in to update a project.");
      if (input.budgetedAmount !== undefined && !["OWNER", "ADMIN"].includes(user.role)) {
        throw new Error("You are not authorized to edit the project budget.");
      }
      return projectService.update(id, input, ctx);
    },

    deleteProject: async (
      _parent: unknown,
      { id }: MutationDeleteProjectArgs,
      ctx: GraphQLContext
    ): Promise<any> => {
      return projectService.delete(id, ctx);
    },
  },

  // -----------------------
  // 🔗 RELATIONS
  // -----------------------
  Project: {
    client: (
      parent: { id: string },
      _args: unknown,
      ctx: GraphQLContext
    ): Promise<any> => {
      return projectService.getClient(parent.id, ctx);
    },

    invoices: (
      parent: { id: string },
      _args: unknown,
      ctx: GraphQLContext
    ): Promise<any[]> => {
      return projectService.getInvoices(parent.id, ctx);
    },

    quotes: (
      parent: { id: string },
      _args: unknown,
      ctx: GraphQLContext
    ): Promise<any[]> => {
      return projectService.getQuotes(parent.id, ctx);
    },

    tasks: (
      parent: { id: string },
      _args: unknown,
      ctx: GraphQLContext
    ): Promise<any[]> => {
      return projectService.getTasks(parent.id, ctx);
    },

    expenses: (
      parent: { id: string },
      _args: unknown,
      ctx: GraphQLContext
    ): Promise<any[]> => {
      return projectService.getExpenses(parent.id, ctx);
    },

    timeLogs: (
      parent: { id: string },
      _args: unknown,
      ctx: GraphQLContext
    ): Promise<any[]> => {
      return projectService.getTimeLogs(parent.id, ctx);
    },

    // -----------------------
    // 🧮 REPORTING (NEW)
    // -----------------------
    financialSummary: (
      parent: { id: string },
      _args: unknown,
      ctx: GraphQLContext
    ): Promise<any> => {
      return projectService.getFinancialSummary(parent.id, ctx);
    },

    isOverdue: (
      parent: { endDate?: string | Date | null }
    ): boolean => {
      if (!parent.endDate) return false;
      return new Date(parent.endDate) < new Date();
    },

    progress: async (
      parent: { id: string },
      _args: unknown,
      ctx: GraphQLContext
    ): Promise<number> => {
      const tasks = await ctx.prisma.task.findMany({
        where: { projectId: parent.id, deletedAt: null },
      });
      if (!tasks.length) return 0;
      const done = tasks.filter((t) => t.isCompleted).length;
      return done / tasks.length;
    },

    totalHoursWorked: async (
      parent: { id: string },
      _args: unknown,
      ctx: GraphQLContext
    ): Promise<number> => {
      const result = await ctx.prisma.timeLog.aggregate({
        where: { projectId: parent.id, deletedAt: null },
        _sum: { hoursWorked: true },
      });
      const hours = result._sum.hoursWorked;
      return hours ? Number(hours) : 0;
    },
  },
};
