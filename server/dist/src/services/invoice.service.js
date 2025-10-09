export const invoiceService = {
    // # returns invoices for a project
    getAllByProject: async (projectId, ctx) => {
        // 1. Build the base "where" clause to only find non-deleted invoices
        const where = {
            deletedAt: null,
        };
        // 2. If a projectId is provided, add it to the filter
        if (projectId) {
            where.projectId = projectId;
        }
        return await ctx.prisma.invoice.findMany({
            where, // <-- CHANGED
            include: { items: true, payments: true, project: { include: { client: true } } },
        });
    },
    // # fetch single invoice
    getById: async (id, ctx) => {
        // CHANGED: use findFirst to filter by deletedAt
        return await ctx.prisma.invoice.findFirst({
            where: {
                id,
                deletedAt: null,
            },
            include: {
                items: true,
                payments: true,
                project: true,
            },
        });
    },
    // # create invoice
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
                subtotal,
                gstRate,
                gstAmount,
                totalAmount,
                items: {
                    create: input.items.map((i) => ({
                        description: i.description,
                        quantity: i.quantity ?? 1,
                        unitPrice: i.unitPrice,
                        total: (i.quantity ?? 1) * i.unitPrice,
                    })),
                },
            },
            include: { items: true, payments: true },
        });
    },
    // # create invoice from a quote
    createFromQuote: async (quoteId, ctx) => {
        const quote = await ctx.prisma.quote.findFirst({
            where: { id: quoteId, deletedAt: null },
            include: { items: true },
        });
        if (!quote) {
            throw new Error("Quote not found to create an invoice from.");
        }
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
                    subtotal: quote.subtotal,
                    gstRate: quote.gstRate,
                    gstAmount: quote.gstAmount,
                    totalAmount: quote.totalAmount,
                    items: {
                        create: quote.items.map(item => ({
                            description: item.description,
                            quantity: item.quantity,
                            unitPrice: item.unitPrice,
                            total: item.total,
                        })),
                    },
                },
                include: { items: true, project: true }
            });
            await prisma.quote.update({
                where: { id: quoteId },
                data: { status: "ACCEPTED" },
            });
            return createdInvoice;
        });
    },
    // # update invoice details
    update: async (id, input, ctx) => {
        const { items, ...invoiceDataWithNulls } = input;
        const invoiceData = {
            invoiceNumber: invoiceDataWithNulls.invoiceNumber ?? undefined,
            dueDate: invoiceDataWithNulls.dueDate ?? undefined,
            status: invoiceDataWithNulls.status ?? undefined,
            gstRate: invoiceDataWithNulls.gstRate ?? undefined,
        };
        return await ctx.prisma.$transaction(async (prisma) => {
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
                include: { items: true, payments: true },
            });
        });
    },
    // # delete invoice by ID (now a soft delete)
    delete: async (id, ctx) => {
        // CHANGED: This is now a soft delete
        return await ctx.prisma.invoice.update({
            where: { id },
            data: {
                deletedAt: new Date(),
            },
        });
    },
};
//# sourceMappingURL=invoice.service.js.map