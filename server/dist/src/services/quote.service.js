export const quoteService = {
    getById: (id, ctx) => {
        return ctx.prisma.quote.findUnique({
            where: { id },
            include: { items: true, job: true },
        });
    },
    getByJob: (jobId, ctx) => {
        return ctx.prisma.quote.findMany({
            where: { jobId },
            include: { items: true, job: true },
        });
    },
    create: async (input, ctx) => {
        const subtotal = input.items.reduce((sum, item) => sum + (item.quantity ?? 1) * item.unitPrice, 0);
        const gstRate = input.gstRate ?? 0.1;
        const gstAmount = subtotal * gstRate;
        const totalAmount = subtotal + gstAmount;
        return ctx.prisma.quote.create({
            data: {
                jobId: input.jobId,
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
                job: true,
            },
        });
    },
    update: async (id, input, ctx) => {
        return ctx.prisma.$transaction(async (prisma) => {
            // Step 1 & 2: Update scalar fields and replace items if provided
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
            // Step 3: Recalculate totals based on the new state
            const currentItems = await prisma.quoteItem.findMany({ where: { quoteId: id } });
            const subtotal = currentItems.reduce((sum, i) => sum + i.total, 0);
            const currentQuoteState = await prisma.quote.findUnique({ where: { id } });
            const gstRate = currentQuoteState.gstRate;
            const gstAmount = subtotal * gstRate;
            const totalAmount = subtotal + gstAmount;
            // Step 4: Final update with new totals
            await prisma.quote.update({ where: { id }, data: { subtotal, gstAmount, totalAmount } });
            // Step 5: (THE FIX) Check the ORIGINAL input and update the job's budget if needed
            if (input.status === "ACCEPTED") {
                const finalQuote = await prisma.quote.findUnique({ where: { id } });
                await prisma.job.update({
                    where: { id: finalQuote.jobId },
                    data: { budgetedAmount: finalQuote.totalAmount },
                });
            }
            // Step 6: Return the final, fully updated quote
            return prisma.quote.findUnique({
                where: { id },
                include: { items: true, job: true },
            });
        });
    },
    delete: (id, ctx) => {
        return ctx.prisma.quote.delete({ where: { id } });
    },
};
//# sourceMappingURL=quote.service.js.map