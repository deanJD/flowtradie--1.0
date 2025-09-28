export const taskService = {
    getAllByJob: (jobId, ctx) => {
        return ctx.prisma.task.findMany({
            where: { jobId },
            orderBy: { createdAt: "desc" },
        });
    },
    getById: (id, ctx) => {
        return ctx.prisma.task.findUnique({
            where: { id },
            include: { assignedTo: true, job: true },
        });
    },
    create: async (input, ctx) => {
        try {
            return await ctx.prisma.task.create({
                data: {
                    ...input,
                    description: input.description ?? null,
                    dueDate: input.dueDate ?? undefined,
                },
                include: { assignedTo: true, job: true },
            });
        }
        catch (error) {
            if (error.code === "P2003") {
                throw new Error("Invalid jobId or assignedToId. Please check that the Job and User exist.");
            }
            throw error;
        }
    },
    update: async (id, input, ctx) => {
        try {
            return await ctx.prisma.task.update({
                where: { id },
                data: {
                    ...input,
                    description: input.description ?? null,
                    dueDate: input.dueDate ?? undefined,
                },
                include: { assignedTo: true, job: true },
            });
        }
        catch (error) {
            if (error.code === "P2003") {
                throw new Error("Invalid jobId or assignedToId. Please check that the Job and User exist.");
            }
            throw error;
        }
    },
    delete: (id, ctx) => {
        return ctx.prisma.task.delete({ where: { id } });
    },
};
//# sourceMappingURL=task.service.js.map