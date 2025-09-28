// This file is now fully typed with TypeScript.
export const quoteResolvers = {
    Query: {
        quote: (_parent, { id }, { prisma }) => {
            return prisma.quote.findUnique({
                where: { id },
            });
        },
    },
    Mutation: {
        createQuote: (_parent, { input }, { prisma }) => {
            // Calculate the total amount from the line items on the server-side
            // to ensure data integrity.
            const totalAmount = input.items.reduce((sum, item) => {
                const itemTotal = item.quantity * item.unitPrice;
                return sum + itemTotal;
            }, 0);
            return prisma.quote.create({
                data: {
                    jobId: input.jobId,
                    quoteNumber: input.quoteNumber,
                    status: input.status,
                    expiryDate: input.expiryDate,
                    totalAmount: totalAmount,
                    // Create the related quote items in the same database transaction.
                    items: {
                        create: input.items.map(item => ({
                            description: item.description,
                            quantity: item.quantity,
                            unitPrice: item.unitPrice,
                            total: item.quantity * item.unitPrice,
                        })),
                    },
                },
            });
        },
    },
    // --- Relational Resolvers ---
    Quote: {
        // FIX: Made this function async to correctly handle returning a Promise.
        job: async (parent, _args, { prisma }) => {
            // We check for parent.jobId to prevent a crash if it's somehow missing.
            if (!parent.jobId)
                return null;
            return prisma.job.findUnique({ where: { id: parent.jobId } });
        },
        items: (parent, _args, { prisma }) => {
            return prisma.quoteItem.findMany({ where: { quoteId: parent.id } });
        },
    },
};
//# sourceMappingURL=quote.js.map