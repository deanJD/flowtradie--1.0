import { paymentService } from "../../services/payment.service.js";
export const paymentResolvers = {
    Query: {
        paymentsByInvoice: (_p, { invoiceId }, ctx) => paymentService.getByInvoice(invoiceId, ctx),
    },
    Mutation: {
        // THIS IS THE FIX: Renamed to match the schema
        recordPayment: (_p, { input }, ctx) => paymentService.create(input, ctx),
        updatePayment: (_p, { id, input }, ctx) => paymentService.update(id, input, ctx),
        deletePayment: (_p, { id }, ctx) => paymentService.delete(id, ctx),
    },
};
//# sourceMappingURL=payment.js.map