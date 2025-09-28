// This file contains all the business logic for handling JobExpense data.
export const expenseResolvers = {
    Query: {
        expenses: (_parent, { jobId }, { prisma }) => {
            return prisma.jobExpense.findMany({
                where: { jobId },
                orderBy: { date: 'desc' },
            });
        },
    },
    Mutation: {
        createExpense: (_parent, { input }, { prisma }) => {
            return prisma.jobExpense.create({ data: input });
        },
        deleteExpense: (_parent, { id }, { prisma }) => {
            return prisma.jobExpense.delete({ where: { id } });
        },
    },
    // --- Relational Resolver ---
    JobExpense: {
        job: (parent, _args, { prisma }) => {
            return prisma.job.findUnique({ where: { id: parent.jobId } });
        },
    },
};
//# sourceMappingURL=expense.js.map