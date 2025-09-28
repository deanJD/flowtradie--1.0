// This file is now fully typed with TypeScript.
export const invoiceResolvers = {
    Query: {
        invoice: (_parent, { id }, { prisma }) => {
            return prisma.invoice.findUnique({
                where: { id },
            });
        },
    },
    Mutation: {
        // This is a more complex mutation that requires calculating the total
        // and creating related items in a single, safe database transaction.
        createInvoice: async (_parent, { input }, { prisma }) => {
            const { jobId, invoiceNumber, dueDate, status, items } = input;
            // 1. Calculate the total amount from the line items.
            const totalAmount = items.reduce((sum, item) => {
                const quantity = item.quantity || 1;
                return sum + quantity * item.unitPrice;
            }, 0);
            // 2. Prepare the line items for creation, calculating each item's total.
            const invoiceItemsData = items.map(item => {
                const quantity = item.quantity || 1;
                return {
                    description: item.description,
                    quantity: quantity,
                    unitPrice: item.unitPrice,
                    total: quantity * item.unitPrice,
                };
            });
            // 3. Create the invoice and its items in a single transaction
            //    to ensure data integrity.
            return prisma.invoice.create({
                data: {
                    invoiceNumber,
                    dueDate,
                    status,
                    totalAmount,
                    job: {
                        connect: { id: jobId },
                    },
                    items: {
                        createMany: {
                            data: invoiceItemsData,
                        },
                    },
                },
            });
        },
    },
    // --- Relational Resolvers ---
    Invoice: {
        // Resolve the 'job' field for an Invoice.
        job: (parent, _args, { prisma }) => {
            // The parent.jobId is guaranteed to exist by our schema, so we can look it up.
            return prisma.job.findUnique({ where: { id: parent.jobId } });
        },
        // Resolve the 'items' field for an Invoice.
        items: (parent, _args, { prisma }) => {
            return prisma.invoiceItem.findMany({ where: { invoiceId: parent.id } });
        },
    },
};
//# sourceMappingURL=invoice.js.map