export const paymentService = {
    getByInvoice: (invoiceId, ctx) => {
        return ctx.prisma.payment.findMany({
            where: { invoiceId },
            orderBy: { date: "desc" },
        });
    },
    create: async (input, ctx) => {
        const payment = await ctx.prisma.payment.create({
            data: {
                ...input,
                date: input.date ?? new Date(),
            },
        });
        // Update invoice status if fully or partially paid
        const invoice = await ctx.prisma.invoice.findUnique({
            where: { id: input.invoiceId },
            include: { payments: true },
        });
        if (invoice) {
            const paidSoFar = invoice.payments.reduce((sum, p) => sum + p.amount, 0) + input.amount;
            let newStatus = invoice.status;
            if (paidSoFar >= invoice.totalAmount) {
                newStatus = "PAID";
            }
            else if (paidSoFar > 0) {
                newStatus = "PARTIALLY_PAID";
            }
            await ctx.prisma.invoice.update({
                where: { id: invoice.id },
                data: { status: newStatus },
            });
        }
        return payment;
    },
    update: (id, input, ctx) => {
        return ctx.prisma.payment.update({
            where: { id },
            data: input,
        });
    },
    delete: (id, ctx) => {
        return ctx.prisma.payment.delete({ where: { id } });
    },
};
//# sourceMappingURL=payment.service.js.map