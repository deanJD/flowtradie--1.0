// server/src/graphql/resolvers/expense.ts

import { GraphQLContext } from "../../context.js";
import { expenseService } from "../../services/expense.service.js";
import { CreateExpenseInput } from "@/__generated__/graphql.js";

export const expenseResolvers = {
  Query: {
    expenses: (
      _p: unknown,
      { projectId }: { projectId: string },
      ctx: GraphQLContext
    ) => expenseService.getAllByProject(projectId, ctx),
  },
  Mutation: {
    createExpense: (
      _p: unknown,
      { input }: { input: CreateExpenseInput },
      ctx: GraphQLContext
    ) => expenseService.create(input, ctx),

    deleteExpense: (
      _p: unknown,
      { id }: { id: string },
      ctx: GraphQLContext
    ) => expenseService.delete(id, ctx),
  },

  // Note: The relational resolver for `ProjectExpense.project` is no longer needed
  // because our new service functions automatically include that data.
};