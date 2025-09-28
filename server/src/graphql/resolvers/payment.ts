import { paymentService } from "../../services/payment.service.js";
import { GraphQLContext } from "../../context.js";

interface CreatePaymentArgs {
  input: {
    invoiceId: string;
    amount: number;
    method: string;
    notes?: string;
    date?: Date;
  };
}

interface UpdatePaymentArgs {
  id: string;
  input: {
    amount?: number;
    method?: string;
    notes?: string;
    date?: Date;
  };
}

export const paymentResolvers = {
  Query: {
    paymentsByInvoice: (_p: unknown, { invoiceId }: { invoiceId: string }, ctx: GraphQLContext) =>
      paymentService.getByInvoice(invoiceId, ctx),
  },

  Mutation: {
    createPayment: (_p: unknown, { input }: CreatePaymentArgs, ctx: GraphQLContext) =>
      paymentService.create(input, ctx),

    updatePayment: (_p: unknown, { id, input }: UpdatePaymentArgs, ctx: GraphQLContext) =>
      paymentService.update(id, input, ctx),

    deletePayment: (_p: unknown, { id }: { id: string }, ctx: GraphQLContext) =>
      paymentService.delete(id, ctx),
  },
};
