export const invoiceService = {
    getById: (id, ctx) => {
        return ctx.prisma.invoice.findUnique({
            where: { id },
            include: { items: true, payments: true, job: true },
        });
    },
    create: async (input, ctx) => {
        const gstRate = input.gstRate ?? 0.1;
        const gstAmount = input.subtotal * gstRate;
        const totalAmount = input.subtotal + gstAmount;
        return ctx.prisma.invoice.create({
            data: {
                jobId: input.jobId,
                invoiceNumber: input.invoiceNumber,
                dueDate: input.dueDate,
                status: input.status ?? "DRAFT",
                subtotal: input.subtotal,
                gstRate,
                gstAmount,
                totalAmount,
                items: {
                    create: input.items.map((item) => ({
                        description: item.description,
                        quantity: item.quantity ?? 1,
                        unitPrice: item.unitPrice,
                        total: (item.quantity ?? 1) * item.unitPrice,
                    })),
                },
            },
            include: { items: true, payments: true },
        });
    },
    update: async (id, input, ctx) => {
        const existing = await ctx.prisma.invoice.findUnique({ where: { id } });
        if (!existing)
            throw new Error("Invoice not found");
        const baseSubtotal = input.subtotal ?? existing.subtotal;
        const baseRate = input.gstRate ?? existing.gstRate;
        const gstAmount = baseSubtotal * baseRate;
        const totalAmount = baseSubtotal + gstAmount;
        return ctx.prisma.invoice.update({
            where: { id },
            data: {
                ...input,
                gstAmount,
                totalAmount,
            },
            include: { items: true, payments: true },
        });
    },
};
//# sourceMappingURL=invoice.service.js.map