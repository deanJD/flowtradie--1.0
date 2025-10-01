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
        // Server-side calculation of totals
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
        const { items, ...quoteDataWithNulls } = input;
        const quoteData = {
            quoteNumber: quoteDataWithNulls.quoteNumber ?? undefined,
            expiryDate: quoteDataWithNulls.expiryDate ?? undefined,
            status: quoteDataWithNulls.status ?? undefined,
            gstRate: quoteDataWithNulls.gstRate ?? undefined,
        };
        return ctx.prisma.$transaction(async (prisma) => {
            // Step 1: Update the scalar fields
            let updatedQuote = await prisma.quote.update({
                where: { id },
                data: quoteData,
            });
            // Step 2: If items are provided, replace them
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
            // Step 3: Recalculate totals
            const currentItems = await prisma.quoteItem.findMany({ where: { quoteId: id } });
            const subtotal = currentItems.reduce((sum, i) => sum + i.total, 0);
            const gstRate = updatedQuote.gstRate;
            const gstAmount = subtotal * gstRate;
            const totalAmount = subtotal + gstAmount;
            // Step 4: Final update with new totals
            updatedQuote = await prisma.quote.update({
                where: { id },
                data: { subtotal, gstAmount, totalAmount },
            });
            // vvvvvvvvvv NEW LOGIC ADDED BELOW vvvvvvvvvv
            // Step 5: If the quote was just accepted, update the parent job's budget
            if (updatedQuote.status === "ACCEPTED") {
                await prisma.job.update({
                    where: { id: updatedQuote.jobId },
                    data: { budgetedAmount: updatedQuote.totalAmount },
                });
            }
            // ^^^^^^^^^^ NEW LOGIC ADDED ABOVE ^^^^^^^^^^
            // Step 6: Return the fully updated quote with its relations
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