// server/src/services/expense.service.ts

import { GraphQLContext } from "../context.js";
import { CreateExpenseInput } from "@/__generated__/graphql.js";

// Define the 'include' object once to keep our code DRY
const expenseInclude = {
  job: true,
};

export const expenseService = {
  getAllByJob: (jobId: string, ctx: GraphQLContext) => {
    return ctx.prisma.jobExpense.findMany({
      where: { jobId },
      orderBy: { date: "desc" },
      include: expenseInclude,
    });
  },

  create: (input: CreateExpenseInput, ctx: GraphQLContext) => {
    return ctx.prisma.jobExpense.create({
      data: input,
      include: expenseInclude,
    });
  },

  delete: (id: string, ctx: GraphQLContext) => {
    return ctx.prisma.jobExpense.delete({ where: { id } });
  },

  // Note: We can add an 'update' function here later
  // if you decide you need that feature.
};