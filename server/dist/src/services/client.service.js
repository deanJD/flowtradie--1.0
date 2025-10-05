export const clientService = {
    getAll: (ctx) => {
        return ctx.prisma.client.findMany({
            orderBy: { createdAt: "desc" },
        });
    },
    getById: (id, ctx) => {
        return ctx.prisma.client.findUnique({
            where: { id },
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
        return ctx.prisma.client.delete({
            where: { id },
        });
    },
};
//# sourceMappingURL=client.service.js.map