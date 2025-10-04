// server/src/services/timelog.service.ts
// Define the 'include' object once to keep our code DRY
const timeLogInclude = {
    job: true,
    user: true,
};
export const timeLogService = {
    getAllByJob: (jobId, ctx) => {
        return ctx.prisma.timeLog.findMany({
            where: { jobId },
            orderBy: { date: "desc" },
            include: timeLogInclude,
        });
    },
    getAllByUser: (userId, ctx) => {
        return ctx.prisma.timeLog.findMany({
            where: { userId },
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
        return ctx.prisma.timeLog.delete({ where: { id } });
    },
};
//# sourceMappingURL=timelog.service.js.map