// server/src/services/expense.service.ts
// Define the 'include' object once to keep our code DRY
const expenseInclude = {
    job: true,
};
export const expenseService = {
    getAllByJob: (jobId, ctx) => {
        return ctx.prisma.jobExpense.findMany({
            where: { jobId },
            orderBy: { date: "desc" },
            include: expenseInclude,
        });
    },
    create: (input, ctx) => {
        return ctx.prisma.jobExpense.create({
            data: input,
            include: expenseInclude,
        });
    },
    delete: (id, ctx) => {
        return ctx.prisma.jobExpense.delete({ where: { id } });
    },
    // Note: We can add an 'update' function here later
    // if you decide you need that feature.
};
//# sourceMappingURL=expense.service.js.map