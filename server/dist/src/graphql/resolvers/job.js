export const jobResolvers = {
    Query: {
        jobs: (_p, _a, ctx) => {
            return ctx.prisma.job.findMany({
                orderBy: { createdAt: "desc" },
            });
        },
        job: (_p, args, ctx) => {
            return ctx.prisma.job.findUnique({
                where: { id: args.id },
            });
        },
    },
    Mutation: {
        createJob: (_p, args, ctx) => {
            return ctx.prisma.job.create({ data: args.input });
        },
        updateJob: (_p, args, ctx) => {
            return ctx.prisma.job.update({
                where: { id: args.id },
                data: args.input,
            });
        },
        deleteJob: (_p, args, ctx) => {
            return ctx.prisma.job.delete({ where: { id: args.id } });
        },
    },
    // 👇 Relational Resolver
    Job: {
        customer: (parent, _a, ctx) => {
            return ctx.prisma.customer.findUnique({
                where: { id: parent.customerId },
            });
        },
    },
};
//# sourceMappingURL=job.js.map