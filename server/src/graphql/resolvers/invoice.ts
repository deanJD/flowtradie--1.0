import { GraphQLContext } from "../../context.js";
import { invoiceService } from "../../services/invoice.service.js";

// FINAL STEP: Import the newly generated types.
// You may need to adjust the relative path ('../') to be correct.
import { CreateInvoiceInput, UpdateInvoiceInput } from "@/__generated__/graphql.js";


export const invoiceResolvers = {
  Query: {
    // # fetch single invoice by ID
    invoice: async (_p: unknown, { id }: { id: string }, ctx: GraphQLContext) => {
      return await invoiceService.getById(id, ctx);
    },

    // # fetch all invoices for a job
    invoices: async (
      _p: unknown,
      { jobId }: { jobId?: string },
      ctx: GraphQLContext
    ) => {
      const result = await invoiceService.getAllByJob(jobId, ctx);
      return result ?? [];
    },
  },

  Mutation: {
    // # create invoice
    createInvoice: async (
      _p: unknown,
      { input }: { input: CreateInvoiceInput }, // No longer 'any'
      ctx: GraphQLContext
    ) => {
      return await invoiceService.create(input, ctx);
    },

    // # update invoice
    updateInvoice: async (
      _p: unknown,
      { id, input }: { id: string; input: UpdateInvoiceInput }, // No longer 'any'
      ctx: GraphQLContext
    ) => {
      return await invoiceService.update(id, input, ctx);
    },

    // # delete invoice
    deleteInvoice: async (_p: unknown, { id }: { id: string }, ctx: GraphQLContext) => {
      return await invoiceService.delete(id, ctx);
    },
  },
};