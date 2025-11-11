// server/src/graphql/resolvers/invoiceSettings.ts
import { GraphQLContext } from "../../context.js";
import {
  getInvoiceSettings,
  updateInvoiceSettings,
} from "../../services/invoiceSettings.service.js";
import { InvoiceSettingsInput } from "@/__generated__/graphql.js";

export const invoiceSettingsResolvers = {
  Query: {
    invoiceSettings: async (
      _parent: unknown,
      _args: unknown,
      ctx: GraphQLContext
    ) => {
      // ✅ No authentication required
      // Just return the first settings row in the DB
      return getInvoiceSettings();
    },
  },

  Mutation: {
    updateInvoiceSettings: async (
      _parent: unknown,
      { input }: { input: InvoiceSettingsInput },
      ctx: GraphQLContext
    ) => {
      // ✅ No authentication required
      // Always use the first settings record
      return updateInvoiceSettings(input);
    },
  },
};
