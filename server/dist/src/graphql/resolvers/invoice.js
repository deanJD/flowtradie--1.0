import { invoiceService } from "../../services/invoice.service.js";
export const invoiceResolvers = {
    Query: {
        // # fetch single invoice by ID
        invoice: async (_p, { id }, ctx) => {
            return await invoiceService.getById(id, ctx);
        },
        // # fetch all invoices for a project
        invoices: async (_p, { projectId }, ctx) => {
            const result = await invoiceService.getAllByProject(projectId, ctx);
            return result ?? [];
        },
    },
    Mutation: {
        // # create invoice
        createInvoice: async (_p, { input }, // No longer 'any'
        ctx) => {
            return await invoiceService.create(input, ctx);
        },
        // # update invoice
        updateInvoice: async (_p, { id, input }, // No longer 'any'
        ctx) => {
            return await invoiceService.update(id, input, ctx);
        },
        // # delete invoice
        deleteInvoice: async (_p, { id }, ctx) => {
            return await invoiceService.delete(id, ctx);
        },
        // vvvv THIS IS THE NEW LINE YOU ARE ADDING vvvv
        createInvoiceFromQuote: (_p, { quoteId }, ctx) => invoiceService.createFromQuote(quoteId, ctx),
        // ^^^^ THIS IS THE NEW LINE YOU ARE ADDING ^^^^
    },
};
//# sourceMappingURL=invoice.js.map