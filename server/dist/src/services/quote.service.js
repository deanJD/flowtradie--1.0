export const quoteService = {
    getById: (id, ctx) => {
        // CHANGED: Use findFirst to ensure we don't fetch a deleted quote
        return ctx.prisma.quote.findFirst({
            where: {
                id,
                deletedAt: null,
            },
            include: { items: true, project: true },
        });
    },
    getByProject: (projectId, ctx) => {
        return ctx.prisma.quote.findMany({
            where: {
                projectId,
                deletedAt: null, // <-- CHANGED: Only find non-deleted quotes
            },
            include: { items: true, project: true },
        });
    },
    create: async (input, ctx) => {
        const subtotal = input.items.reduce((sum, item) => sum + (item.quantity ?? 1) * item.unitPrice, 0);
        const gstRate = input.gstRate ?? 0.1;
        const gstAmount = subtotal * gstRate;
        const totalAmount = subtotal + gstAmount;
        return ctx.prisma.quote.create({
            data: {
                projectId: input.projectId,
                quoteNumber: input.quoteNumber,
                expiryDate: input.expiryDate,
                status: input.status ?? "DRAFT",
                items: {
                    create: input.items.map((item) => ({
                        description: item.description,
                        quantity: item.quantity ?? 1,
                        unitPrice: item.unitPrice,
                        total: (item.quantity ?? 1) * item.unitPrice,
                    })),
                },
                subtotal,
                gstRate,
                gstAmount,
                totalAmount,
            },
            include: {
                items: true,
                project: true,
            },
        });
    },
    update: async (id, input, ctx) => {
        return ctx.prisma.$transaction(async (prisma) => {
            const { items, ...quoteDataWithNulls } = input;
            const quoteData = {
                quoteNumber: quoteDataWithNulls.quoteNumber ?? undefined,
                expiryDate: quoteDataWithNulls.expiryDate ?? undefined,
                status: quoteDataWithNulls.status ?? undefined,
                gstRate: quoteDataWithNulls.gstRate ?? undefined,
            };
            await prisma.quote.update({ where: { id }, data: quoteData });
            if (items) {
                await prisma.quoteItem.deleteMany({ where: { quoteId: id } });
                await prisma.quoteItem.createMany({
                    data: items.map((item) => ({
                        quoteId: id,
                        description: item.description,
                        quantity: item.quantity ?? 1,
                        unitPrice: item.unitPrice,
                        total: (item.quantity ?? 1) * item.unitPrice,
                    })),
                });
            }
            const currentItems = await prisma.quoteItem.findMany({ where: { quoteId: id } });
            const subtotal = currentItems.reduce((sum, i) => sum + i.total, 0);
            const currentQuoteState = await prisma.quote.findUnique({ where: { id } });
            const gstRate = currentQuoteState.gstRate;
            const gstAmount = subtotal * gstRate;
            const totalAmount = subtotal + gstAmount;
            await prisma.quote.update({ where: { id }, data: { subtotal, gstAmount, totalAmount } });
            if (input.status === "ACCEPTED") {
                const finalQuote = await prisma.quote.findUnique({ where: { id } });
                await prisma.project.update({
                    where: { id: finalQuote.projectId },
                    data: { budgetedAmount: finalQuote.totalAmount },
                });
            }
            return prisma.quote.findUnique({
                where: { id },
                include: { items: true, project: true },
            });
        });
    },
    delete: (id, ctx) => {
        // CHANGED: This is now a soft delete
        return ctx.prisma.quote.update({
            where: { id },
            data: {
                deletedAt: new Date(),
            },
        });
    },
};
//# sourceMappingURL=quote.service.js.map