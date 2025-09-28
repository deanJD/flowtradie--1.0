import { invoiceService } from "../../services/invoice.service.js";
export const invoiceResolvers = {
    Query: {
        invoice: (_p, { id }, ctx) => invoiceService.getById(id, ctx),
    },
    Mutation: {
        createInvoice: (_p, { input }, ctx) => invoiceService.create(input, ctx),
        updateInvoice: (_p, { id, input }, ctx) => invoiceService.update(id, input, ctx),
    },
};
//# sourceMappingURL=invoice.js.map