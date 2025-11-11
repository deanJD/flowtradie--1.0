import { invoiceService } from "../../services/invoice.service.js";
export const invoiceResolvers = {
    Query: {
        invoice: (_p, { id }, ctx) => {
            return invoiceService.getById(id, ctx);
        },
        invoices: async (_p, { projectId }, ctx) => {
            const result = await invoiceService.getAll(projectId, ctx);
            return result ?? [];
        },
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
    },
};
//# sourceMappingURL=invoice.js.map