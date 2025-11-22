import { paymentService } from "../../services/payment.service.js";
export const paymentResolvers = {
    Query: {
        // MATCHES: payments(invoiceId: ID!): [Payment!]!
        payments: (_p, { invoiceId }, ctx) => paymentService.getByInvoice(invoiceId, ctx),
    },
    Mutation: {
        // MATCHES: createPayment(input: CreatePaymentInput!): Payment!
        createPayment: (_p, { input }, ctx) => paymentService.create(input, ctx),
        // MATCHES: updatePayment(id: ID!, input: UpdatePaymentInput!): Payment!
        updatePayment: (_p, { id, input }, ctx) => paymentService.update(id, input, ctx),
        // MATCHES: deletePayment(id: ID!): Payment!
        deletePayment: (_p, { id }, ctx) => paymentService.delete(id, ctx),
    },
};
//# sourceMappingURL=payment.js.map