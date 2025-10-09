// server/src/services/timelog.service.ts
// Define the 'include' object once to keep our code DRY
const timeLogInclude = {
    project: true,
    user: true,
};
export const timeLogService = {
    getAllByProject: (projectId, ctx) => {
        return ctx.prisma.timeLog.findMany({
            where: {
                projectId,
                deletedAt: null, // <-- CHANGED
            },
            orderBy: { date: "desc" },
            include: timeLogInclude,
        });
    },
    getAllByUser: (userId, ctx) => {
        return ctx.prisma.timeLog.findMany({
            where: {
                userId,
                deletedAt: null, // <-- CHANGED
            },
            orderBy: { date: "desc" },
            include: timeLogInclude,
        });
    },
    create: (input, ctx) => {
        return ctx.prisma.timeLog.create({
            data: input,
            include: timeLogInclude,
        });
    },
    update: (id, input, ctx) => {
        // Manually build the data object to handle nulls
        const data = {
            date: input.date ?? undefined,
            hoursWorked: input.hoursWorked ?? undefined,
            notes: input.notes ?? undefined,
        };
        return ctx.prisma.timeLog.update({
            where: { id },
            data: data,
            include: timeLogInclude,
        });
    },
    delete: (id, ctx) => {
        // CHANGED: This is now a soft delete
        return ctx.prisma.timeLog.update({
            where: { id },
            data: {
                deletedAt: new Date(),
            },
        });
    },
};
//# sourceMappingURL=timelog.service.js.map