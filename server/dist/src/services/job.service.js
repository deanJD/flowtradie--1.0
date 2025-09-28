export const jobService = {
    getAll: (ctx) => {
        return ctx.prisma.job.findMany({
            orderBy: { createdAt: "desc" },
            include: { customer: true, tasks: true, invoices: true, quotes: true },
        });
    },
    getById: (id, ctx) => {
        return ctx.prisma.job.findUnique({
            where: { id },
            include: { customer: true, tasks: true, invoices: true, quotes: true },
        });
    },
    create: async (input, ctx) => {
        return ctx.prisma.job.create({
            data: {
                ...input,
                description: input.description ?? null,
                location: input.location ?? null,
                startDate: input.startDate ?? null,
                endDate: input.endDate ?? null,
            },
        });
    },
    update: async (id, input, ctx) => {
        return ctx.prisma.job.update({
            where: { id },
            data: {
                ...input,
                description: input.description ?? null,
                location: input.location ?? null,
            },
        });
    },
    delete: (id, ctx) => {
        return ctx.prisma.job.delete({ where: { id } });
    },
};
//# sourceMappingURL=job.service.js.map