// Define the Prisma select object for a "safe" user once.
const selectSafeUser = {
    id: true,
    email: true,
    name: true,
    role: true,
    phone: true,
    businessId: true,
    hourlyRate: true,
    createdAt: true,
    updatedAt: true,
};
export const userService = {
    getAll: (ctx) => {
        return ctx.prisma.user.findMany({
            where: { deletedAt: null }, // <-- CHANGED
            orderBy: { createdAt: "desc" },
            select: selectSafeUser,
        });
    },
    getById: (id, ctx) => {
        // CHANGED: Use findFirst to ensure we don't fetch a deleted user
        return ctx.prisma.user.findFirst({
            where: {
                id,
                deletedAt: null,
            },
            select: selectSafeUser,
        });
    },
    getMe: async (ctx) => {
        if (!ctx.user?.id) {
            throw new Error("Unauthorized"); // 🚨 important!
        }
        return ctx.prisma.user.findFirst({
            where: { id: ctx.user.id, deletedAt: null },
            select: selectSafeUser,
        });
    },
    // vvvvvvvv NEW DELETE FUNCTION ADDED vvvvvvvv
    delete: (id, ctx) => {
        return ctx.prisma.user.update({
            where: { id },
            data: {
                deletedAt: new Date(),
            },
        });
    },
    // ^^^^^^^^^^ NEW DELETE FUNCTION ADDED ^^^^^^^^^^
};
//# sourceMappingURL=user.service.js.map