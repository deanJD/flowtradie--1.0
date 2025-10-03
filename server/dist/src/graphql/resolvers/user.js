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
                },
            });
        },
        // vvvvvvvvvv NEW RESOLVER ADDED BELOW vvvvvvvvvv
        me: async (_p, _a, ctx) => {
            // If the context doesn't have a user, they're not logged in.
            if (!ctx.user) {
                return null;
            }
            // Fetch the current user from the database using the ID from the context.
            return (await ctx.prisma.user.findUnique({
                where: { id: ctx.user.id },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    role: true,
                    phone: true,
                    hourlyRate: true,
                    createdAt: true,
                    updatedAt: true,
                },
            }));
        },
        // ^^^^^^^^^^ NEW RESOLVER ADDED ABOVE ^^^^^^^^^^
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