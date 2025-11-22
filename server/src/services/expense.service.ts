// server/src/services/expense.service.ts

import { GraphQLContext } from "../context.js";
import { CreateExpenseInput } from "@/__generated__/graphql.js";

const expenseInclude = { project: true };

export const expenseService = {
  getAllByProject: async (projectId: string, ctx: GraphQLContext) => {
    return ctx.prisma.projectExpense.findMany({
      where: { projectId, deletedAt: null },
      orderBy: { createdAt: "desc" }, // Make sure this field matches Prisma!
      include: expenseInclude,
    });
  },

  // server/src/services/expense.service.ts

create: (input: CreateExpenseInput, ctx: GraphQLContext) => {
  // Destructure businessId out of input to avoid passing it directly
  const { businessId, ...rest } = input;
  const { projectId, ...expenseData } = rest;
  return ctx.prisma.projectExpense.create({
    data: {
      ...expenseData,
      business: { connect: { id: businessId } },  // 🔥 REQUIRED
      project: { connect: { id: projectId } },    // 🔥 REQUIRED
    },
    include: expenseInclude,
  });
},

  delete: async (id: string, ctx: GraphQLContext) => {
    return ctx.prisma.projectExpense.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  },
};
