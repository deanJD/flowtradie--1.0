import { invoiceService } from "../../services/invoice.service.js";
export const invoiceResolvers = {
    Query: {
        invoice: (_p, { id }, ctx) => {
            return invoiceService.getById(id, ctx);
        },
        // vvvvvvvvvvvv THIS IS THE FIX vvvvvvvvvvvv
        invoices: async (_p, { projectId }, ctx) => {
            // First, we await the result from the service
            const result = await invoiceService.getAll(projectId, ctx);
            // Then, we use the 'nullish coalescing operator' (??) as a safety net.
            // If 'result' is null or undefined, it will return an empty array instead.
            return result ?? [];
        },
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    },
    Mutation: {
        createInvoice: (_p, { input }, ctx) => {
            return invoiceService.create(input, ctx);
        },
        updateInvoice: (_p, { id, input }, ctx) => {
            return invoiceService.update(id, input, ctx);
        },
        deleteInvoice: (_p, { id }, ctx) => {
            return invoiceService.delete(id, ctx);
        },
        createInvoiceFromQuote: (_p, { quoteId }, ctx) => {
            return invoiceService.createFromQuote(quoteId, ctx);
        },
    },
};
//# sourceMappingURL=invoice.js.map