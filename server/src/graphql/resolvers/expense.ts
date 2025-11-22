// server/src/graphql/resolvers/expense.ts

import { GraphQLContext } from "../../context.js";
import { expenseService } from "../../services/expense.service.js";
import {
  Resolvers,
  QueryExpensesArgs,
  MutationCreateExpenseArgs,
  MutationDeleteExpenseArgs,
} from "@/__generated__/graphql.js";

export const expenseResolvers: Resolvers = {
  Query: {
    expenses: async (
      _p: unknown,
      { projectId }: QueryExpensesArgs,
      ctx: GraphQLContext
    ) => {
      return expenseService.getAllByProject(projectId, ctx) as any;
    },
  },

  Mutation: {
    createExpense: async (
      _p: unknown,
      { input }: MutationCreateExpenseArgs,
      ctx: GraphQLContext
    ) => {
      return expenseService.create(input, ctx) as any;
    },

    deleteExpense: async (
      _p: unknown,
      { id }: MutationDeleteExpenseArgs,
      ctx: GraphQLContext
    ) => {
      return expenseService.delete(id, ctx) as any;
    },
  },
};
