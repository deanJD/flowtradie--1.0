// src/graphql/resolvers/invoice.ts
import { GraphQLContext } from "../../context.js";
import { invoiceService } from "../../services/invoice.service.js";

export const invoiceResolvers = {
  Query: {
    invoice: (_p: unknown, { id }: { id: string }, ctx: GraphQLContext) =>
      invoiceService.getById(id, ctx),
  },

  Mutation: {
    createInvoice: (_p: unknown, { input }: any, ctx: GraphQLContext) =>
      invoiceService.create(input, ctx),

    updateInvoice: (_p: unknown, { id, input }: any, ctx: GraphQLContext) =>
      invoiceService.update(id, input, ctx),
  },
};
