import { GraphQLContext } from "../../context.js";
import {
  CreatePaymentInput,
  UpdatePaymentInput,
} from "@/__generated__/graphql.js";
import { paymentService } from "../../services/payment.service.js";

export const paymentResolvers = {
  Mutation: {
    createPayment(
      _parent: unknown,
      { input }: { input: CreatePaymentInput },
      ctx: GraphQLContext
    ) {
      return paymentService.create(input, ctx);
    },

    updatePayment(
      _parent: unknown,
      { id, input }: { id: string; input: UpdatePaymentInput },
      ctx: GraphQLContext
    ) {
      return paymentService.update(id, input, ctx);
    },

    deletePayment(
      _parent: unknown,
      { id }: { id: string },
      ctx: GraphQLContext
    ) {
      return paymentService.delete(id, ctx);
    },
  },
};
