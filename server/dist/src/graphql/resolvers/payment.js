import { paymentService } from "../../services/payment.service.js";
export const paymentResolvers = {
    Mutation: {
        createPayment(_parent, { input }, ctx) {
            return paymentService.create(input, ctx);
        },
        updatePayment(_parent, { id, input }, ctx) {
            return paymentService.update(id, input, ctx);
        },
        deletePayment(_parent, { id }, ctx) {
            return paymentService.delete(id, ctx);
        },
    },
};
//# sourceMappingURL=payment.js.map