// server/src/services/expense.service.ts
// Define the 'include' object once to keep our code DRY
const expenseInclude = {
    project: true,
};
export const expenseService = {
    getAllByProject: (projectId, ctx) => {
        return ctx.prisma.projectExpense.findMany({
            where: {
                projectId,
                deletedAt: null, // <-- CHANGED
            },
            orderBy: { date: "desc" },
            include: expenseInclude,
        });
    },
    create: (input, ctx) => {
        return ctx.prisma.projectExpense.create({
            data: input,
            include: expenseInclude,
        });
    },
    delete: (id, ctx) => {
        // CHANGED: This is now a soft delete
        return ctx.prisma.projectExpense.update({
            where: { id },
            data: {
                deletedAt: new Date(),
            },
        });
    },
    // Note: We can add an 'update' function here later
    // if you decide you need that feature.
};
//# sourceMappingURL=expense.service.js.map