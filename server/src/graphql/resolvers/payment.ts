import { paymentService } from "../../services/payment.service.js";
import { GraphQLContext } from "../../context.js";
import { CreatePaymentInput, UpdatePaymentInput } from "@/__generated__/graphql.js"; // check names

export const paymentResolvers = {
  Query: {
    // MATCHES: payments(invoiceId: ID!): [Payment!]!
    payments: (
      _p: unknown,
      { invoiceId }: { invoiceId: string },
      ctx: GraphQLContext
    ) => paymentService.getByInvoice(invoiceId, ctx),
  },

  Mutation: {
    // MATCHES: createPayment(input: CreatePaymentInput!): Payment!
    createPayment: (
      _p: unknown,
      { input }: { input: CreatePaymentInput },
      ctx: GraphQLContext
    ) => paymentService.create(input, ctx),

    // MATCHES: updatePayment(id: ID!, input: UpdatePaymentInput!): Payment!
    updatePayment: (
      _p: unknown,
      { id, input }: { id: string; input: UpdatePaymentInput },
      ctx: GraphQLContext
    ) => paymentService.update(id, input, ctx),

    // MATCHES: deletePayment(id: ID!): Payment!
    deletePayment: (
      _p: unknown,
      { id }: { id: string },
      ctx: GraphQLContext
    ) => paymentService.delete(id, ctx),
  },
};
