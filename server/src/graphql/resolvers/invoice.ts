// server/src/graphql/resolvers/invoice.ts
import { GraphQLContext } from "../../context.js";
import { invoiceService } from "../../services/invoice.service.js";
import {
  CreateInvoiceInput,
  UpdateInvoiceInput,
} from "@/__generated__/graphql.js";

export const invoiceResolvers = {
  Query: {
    invoice: (
      _p: unknown,
      { id }: { id: string },
      ctx: GraphQLContext
    ) => {
      return invoiceService.getById(id, ctx);
    },

    invoices: async (
      _p: unknown,
      { projectId }: { projectId?: string },
      ctx: GraphQLContext
    ) => {
      const result = await invoiceService.getAll(projectId, ctx);
      return result ?? [];
    },
  },

  Mutation: {
    createInvoice: (
      _p: unknown,
      { input }: { input: CreateInvoiceInput },
      ctx: GraphQLContext
    ) => {
      return invoiceService.create(input, ctx);
    },

    updateInvoice: (
      _p: unknown,
      { id, input }: { id: string; input: UpdateInvoiceInput },
      ctx: GraphQLContext
    ) => {
      return invoiceService.update(id, input, ctx);
    },

    deleteInvoice: (
      _p: unknown,
      { id }: { id: string },
      ctx: GraphQLContext
    ) => {
      return invoiceService.delete(id, ctx);
    },
  },
};
