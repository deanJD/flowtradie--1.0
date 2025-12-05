// src/graphql/resolvers/expense.ts
import {
  QueryExpensesArgs,
  MutationCreateExpenseArgs,
  MutationDeleteExpenseArgs,
} from "@/__generated__/graphql.js";
import { GraphQLContext } from "../../context.js";

export const expenseResolvers = {
  Query: {
    expenses: async (
      _p: unknown,
      { projectId }: QueryExpensesArgs,
      ctx: GraphQLContext
    ) => {
      return ctx.prisma.projectExpense.findMany({
        where: { projectId, deletedAt: null },
        orderBy: { date: "desc" },
      });
    },
  },

  Mutation: {
    createExpense: async (
      _p: unknown,
      { input }: MutationCreateExpenseArgs,
      ctx: GraphQLContext
    ) => {
      return ctx.prisma.projectExpense.create({
        data: {
          businessId: ctx.user!.businessId!,
          projectId: input.projectId,
          description: input.description,
          amount: input.amount,
          date: input.date ?? new Date(),
          category: input.category,
        },
      });
    },

    deleteExpense: async (
      _p: unknown,
      { id }: MutationDeleteExpenseArgs,
      ctx: GraphQLContext
    ) => {
      return ctx.prisma.projectExpense.update({
        where: { id },
        data: { deletedAt: new Date() },
      });
    },
  },
};
