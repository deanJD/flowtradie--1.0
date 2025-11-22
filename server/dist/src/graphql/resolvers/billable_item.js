export const billableItemService = {
    /* ----------------------------
       Get All Billable Items (by business)
    ---------------------------- */
    getAll: async (businessId, ctx) => {
        return ctx.prisma.billableItem.findMany({
            where: { businessId, deletedAt: null },
            orderBy: { createdAt: "desc" },
        });
    },
    /* ----------------------------
       Get Single by ID
    ---------------------------- */
    getById: async (id, ctx) => {
        return ctx.prisma.billableItem.findFirst({
            where: { id, deletedAt: null },
        });
    },
    /* ----------------------------
       Create New Billable Item
    ---------------------------- */
    create: async (input, businessId, ctx) => {
        return ctx.prisma.billableItem.create({
            data: {
                ...(() => {
                    const { businessId, rate, ...rest } = input;
                    return {
                        ...rest,
                        unitPrice: rate, // Map rate to unitPrice if that's the intended mapping
                    };
                })(),
                business: { connect: { id: businessId } },
            },
        });
    },
    /* ----------------------------
       Update Billable Item
    ---------------------------- */
    update: async (id, input, ctx) => {
        // Remove null fields from input to satisfy Prisma types
        const filteredInput = Object.fromEntries(Object.entries(input).filter(([_, v]) => v !== null));
        return ctx.prisma.billableItem.update({
            where: { id },
            data: filteredInput,
        });
    },
    /* ----------------------------
       Soft Delete
    ---------------------------- */
    delete: async (id, ctx) => {
        return ctx.prisma.billableItem.update({
            where: { id },
            data: { deletedAt: new Date() },
            select: { id: true },
        });
    },
};
//# sourceMappingURL=billable_item.js.map