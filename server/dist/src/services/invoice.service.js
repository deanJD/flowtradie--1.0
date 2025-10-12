export const invoiceService = {
    getAll: async (projectId, ctx) => {
        const where = { deletedAt: null };
        if (projectId) {
            where.projectId = projectId;
        }
        return await ctx.prisma.invoice.findMany({
            where,
            orderBy: { issueDate: 'desc' },
            include: {
                items: true,
                payments: { where: { deletedAt: null } },
                project: { include: { client: true } }
            },
        });
    },
    getById: async (id, ctx) => {
        return await ctx.prisma.invoice.findFirst({
            where: { id, deletedAt: null },
            include: {
                items: true,
                payments: { where: { deletedAt: null } },
                project: true,
            },
        });
    },
    create: async (input, ctx) => {
        const subtotal = input.items.reduce((sum, i) => sum + (i.quantity ?? 1) * i.unitPrice, 0);
        const gstRate = input.gstRate ?? 0.1;
        const gstAmount = subtotal * gstRate;
        const totalAmount = subtotal + gstAmount;
        return ctx.prisma.invoice.create({
            data: {
                projectId: input.projectId,
                invoiceNumber: input.invoiceNumber,
                dueDate: input.dueDate,
                status: input.status ?? "DRAFT",
                subtotal, gstRate, gstAmount, totalAmount,
                items: {
                    create: input.items.map((i) => ({
                        description: i.description,
                        quantity: i.quantity ?? 1,
                        unitPrice: i.unitPrice,
                        total: (i.quantity ?? 1) * i.unitPrice,
                    })),
                },
            },
            include: { items: true, project: { include: { client: true } } },
        });
    },
    createFromQuote: async (quoteId, ctx) => {
        const quote = await ctx.prisma.quote.findFirst({
            where: { id: quoteId, deletedAt: null },
            include: { items: true },
        });
        if (!quote)
            throw new Error("Quote not found.");
        const newInvoiceNumber = `${quote.quoteNumber}-INV`;
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 30);
        return await ctx.prisma.$transaction(async (prisma) => {
            const createdInvoice = await prisma.invoice.create({
                data: {
                    projectId: quote.projectId,
                    invoiceNumber: newInvoiceNumber,
                    dueDate: dueDate,
                    status: "DRAFT",
                    subtotal: quote.subtotal, gstRate: quote.gstRate, gstAmount: quote.gstAmount, totalAmount: quote.totalAmount,
                    items: {
                        create: quote.items.map(item => ({
                            description: item.description,
                            quantity: item.quantity,
                            unitPrice: item.unitPrice,
                            total: item.total,
                        })),
                    },
                },
                include: { items: true, project: { include: { client: true } } }
            });
            await prisma.quote.update({ where: { id: quoteId }, data: { status: "ACCEPTED" } });
            return createdInvoice;
        });
    },
    // vvvvvvvvvvvv THIS IS THE FULLY CORRECTED UPDATE FUNCTION vvvvvvvvvvvv
    update: async (id, input, ctx) => {
        return await ctx.prisma.$transaction(async (prisma) => {
            const { items, ...invoiceDataWithNulls } = input;
            // Correctly handle nulls from GraphQL
            const invoiceData = {
                invoiceNumber: invoiceDataWithNulls.invoiceNumber ?? undefined,
                dueDate: invoiceDataWithNulls.dueDate ?? undefined,
                status: invoiceDataWithNulls.status ?? undefined,
                gstRate: invoiceDataWithNulls.gstRate ?? undefined,
            };
            const updatedInvoice = await prisma.invoice.update({
                where: { id },
                data: invoiceData,
            });
            if (items) {
                await prisma.invoiceItem.deleteMany({ where: { invoiceId: id } });
                await prisma.invoiceItem.createMany({
                    data: items.map((item) => ({
                        invoiceId: id,
                        description: item.description,
                        quantity: item.quantity ?? 1,
                        unitPrice: item.unitPrice,
                        total: (item.quantity ?? 1) * item.unitPrice,
                    })),
                });
            }
            const currentItems = await prisma.invoiceItem.findMany({ where: { invoiceId: id } });
            const subtotal = currentItems.reduce((sum, i) => sum + i.total, 0);
            const gstRate = updatedInvoice.gstRate;
            const gstAmount = subtotal * gstRate;
            const totalAmount = subtotal + gstAmount;
            return await prisma.invoice.update({
                where: { id },
                data: { subtotal, gstAmount, totalAmount },
                include: { items: true, payments: true, project: true },
            });
        });
    },
    // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    // Soft delete an invoice
    delete: async (id, ctx) => {
        return await ctx.prisma.invoice.update({
            where: { id },
            data: {
                deletedAt: new Date(),
            },
        });
    },
};
//# sourceMappingURL=invoice.service.js.map