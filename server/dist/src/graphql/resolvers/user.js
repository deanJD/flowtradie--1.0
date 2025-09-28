export const userResolvers = {
    Query: {
        users: (_p, _a, ctx) => {
            return ctx.prisma.user.findMany({
                orderBy: { createdAt: "desc" },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    role: true,
                    phone: true,
                    hourlyRate: true,
                    createdAt: true,
                    updatedAt: true,
                    // password excluded ✅
                },
            });
        },
        user: (_p, args, ctx) => {
            return ctx.prisma.user.findUnique({
                where: { id: args.id },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    role: true,
                    phone: true,
                    hourlyRate: true,
                    createdAt: true,
                    updatedAt: true,
                    // password excluded ✅
                },
            });
        },
    },
    User: {
        tasks: (parent, _a, ctx) => {
            return ctx.prisma.task.findMany({
                where: { assignedToId: parent.id },
            });
        },
    },
};
//# sourceMappingURL=user.js.map