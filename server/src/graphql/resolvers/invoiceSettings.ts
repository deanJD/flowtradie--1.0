// server/graphql/resolvers/invoiceSettings.resolver.ts
import type { GraphQLContext } from "../../context.js";
import { requireOwnerOrAdmin } from "../../auth/authorize.js";
import { invoiceSettingsService } from "../../services/invoiceSettings.service.js";

export const invoiceSettingsResolvers = {
  Query: {
    invoiceSettings: (_parent: unknown, _args: unknown, ctx: GraphQLContext) => {
      // Only allow authenticated users to read settings
      requireOwnerOrAdmin(ctx);
      return invoiceSettingsService.get(ctx);
    },
  },
  Mutation: {
    updateInvoiceSettings: (
      _parent: unknown,
      { input }: { input: any },
      ctx: GraphQLContext
    ) => {
      requireOwnerOrAdmin(ctx);
      return invoiceSettingsService.upsert(input, ctx);
    },
  },
};
