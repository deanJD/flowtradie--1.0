export const customerService = {
    getAll: (ctx) => {
        return ctx.prisma.customer.findMany({
            orderBy: { createdAt: "desc" },
        });
    },
    getById: (id, ctx) => {
        return ctx.prisma.customer.findUnique({
            where: { id },
        });
    },
    create: (input, ctx) => {
        return ctx.prisma.customer.create({
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
        return ctx.prisma.customer.update({
            where: { id },
            data,
        });
    },
    delete: (id, ctx) => {
        return ctx.prisma.customer.delete({
            where: { id },
        });
    },
};
//# sourceMappingURL=customer.service.js.map