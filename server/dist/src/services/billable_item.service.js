export const billableItemService = {
    // Get all non-deleted items
    getAll: (ctx) => {
        return ctx.prisma.billableItem.findMany({
            where: { deletedAt: null },
            orderBy: { name: "asc" },
        });
    },
    // Create a new item
    create: (input, ctx) => {
        return ctx.prisma.billableItem.create({
            data: input,
        });
    },
    // Update an existing item
    update: (id, input, ctx) => {
        const data = {
            name: input.name ?? undefined,
            description: input.description ?? undefined,
            unitPrice: input.unitPrice ?? undefined,
        };
        return ctx.prisma.billableItem.update({
            where: { id },
            data,
        });
    },
    // Soft delete an item
    delete: (id, ctx) => {
        return ctx.prisma.billableItem.update({
            where: { id },
            data: {
                deletedAt: new Date(),
            },
        });
    },
};
//# sourceMappingURL=billable_item.service.js.map