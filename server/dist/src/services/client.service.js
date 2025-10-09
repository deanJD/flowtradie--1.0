export const clientService = {
    getAll: (ctx) => {
        return ctx.prisma.client.findMany({
            where: { deletedAt: null }, // <-- CHANGED: Only find non-deleted clients
            orderBy: { createdAt: "desc" },
        });
    },
    getById: (id, ctx) => {
        // CHANGED: Use findFirst to ensure we don't fetch a deleted client
        return ctx.prisma.client.findFirst({
            where: {
                id,
                deletedAt: null,
            },
        });
    },
    create: (input, ctx) => {
        return ctx.prisma.client.create({
            data: input,
        });
    },
    update: (id, input, ctx) => {
        const data = {
            name: input.name ?? undefined,
            email: input.email ?? undefined,
            phone: input.phone ?? undefined,
            address: input.address ?? undefined,
        };
        return ctx.prisma.client.update({
            where: { id },
            data,
        });
    },
    delete: (id, ctx) => {
        // CHANGED: This is now a soft delete
        return ctx.prisma.client.update({
            where: { id },
            data: {
                deletedAt: new Date(),
            },
        });
    },
};
//# sourceMappingURL=client.service.js.map