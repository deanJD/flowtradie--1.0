export const expenseResolvers = {
    Query: {
        expenses: async (_p, { projectId }, ctx) => {
            return ctx.prisma.projectExpense.findMany({
                where: { projectId, deletedAt: null },
                orderBy: { date: "desc" },
            });
        },
    },
    Mutation: {
        createExpense: async (_p, { input }, ctx) => {
            return ctx.prisma.projectExpense.create({
                data: {
                    businessId: ctx.user.businessId,
                    projectId: input.projectId,
                    description: input.description,
                    amount: input.amount,
                    date: input.date ?? new Date(),
                    category: input.category,
                },
            });
        },
        deleteExpense: async (_p, { id }, ctx) => {
            return ctx.prisma.projectExpense.update({
                where: { id },
                data: { deletedAt: new Date() },
            });
        },
    },
};
//# sourceMappingURL=expense.js.map