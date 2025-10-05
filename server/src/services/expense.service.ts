// server/src/services/expense.service.ts

import { GraphQLContext } from "../context.js";
import { CreateExpenseInput } from "@/__generated__/graphql.js";

// Define the 'include' object once to keep our code DRY
const expenseInclude = {
  project: true,
};

export const expenseService = {
  getAllByProject: (projectId: string, ctx: GraphQLContext) => {
    return ctx.prisma.projectExpense.findMany({
      where: { projectId },
      orderBy: { date: "desc" },
      include: expenseInclude,
    });
  },

  create: (input: CreateExpenseInput, ctx: GraphQLContext) => {
    return ctx.prisma.projectExpense.create({
      data: input,
      include: expenseInclude,
    });
  },

  delete: (id: string, ctx: GraphQLContext) => {
    return ctx.prisma.projectExpense.delete({ where: { id } });
  },

  // Note: We can add an 'update' function here later
  // if you decide you need that feature.
};