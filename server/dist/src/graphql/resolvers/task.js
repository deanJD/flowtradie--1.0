export const taskResolvers = {
    Query: {
        tasks: (_p, args, ctx) => {
            return ctx.prisma.task.findMany({
                where: { jobId: args.jobId },
                orderBy: { createdAt: "desc" },
                include: { assignedTo: true, job: true },
            });
        },
        task: (_p, args, ctx) => {
            return ctx.prisma.task.findUnique({
                where: { id: args.id },
                include: { assignedTo: true, job: true },
            });
        },
    },
    Mutation: {
        createTask: async (_p, args, ctx) => {
            try {
                return await ctx.prisma.task.create({
                    data: {
                        ...args.input,
                        description: args.input.description ?? null,
                        dueDate: args.input.dueDate ?? undefined,
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
        updateTask: (_p, args, ctx) => {
            return ctx.prisma.task.update({
                where: { id: args.id },
                data: {
                    ...args.input,
                    description: args.input.description ?? null,
                    dueDate: args.input.dueDate ?? undefined,
                },
                include: { assignedTo: true, job: true },
            });
        },
        deleteTask: (_p, args, ctx) => {
            return ctx.prisma.task.delete({ where: { id: args.id } });
        },
    },
    // 👇 Relational Resolvers
    Job: {
        tasks: (parent, _a, ctx) => {
            return ctx.prisma.task.findMany({
                where: { jobId: parent.id },
                orderBy: { createdAt: "desc" },
            });
        },
    },
    Task: {
        assignedTo: (parent, _a, ctx) => {
            return ctx.prisma.user.findUnique({
                where: { id: parent.assignedToId ?? undefined },
            });
        },
        job: (parent, _a, ctx) => {
            return ctx.prisma.job.findUnique({
                where: { id: parent.jobId },
            });
        },
    },
};
//# sourceMappingURL=task.js.map