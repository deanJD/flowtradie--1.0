import type { GraphQLContext } from "../../context.js";
import { requireOwnerOrAdmin } from "../../auth/authorize.js";

import {
  getInvoiceSettings,
  updateInvoiceSettings,
} from "../../services/invoiceSettings.service.js";

export const invoiceSettingsResolvers = {
  Query: {
    invoiceSettings: (
      _parent: unknown,
      _args: unknown,
      ctx: GraphQLContext
    ) => {
      requireOwnerOrAdmin(ctx);
      if (!ctx.user) {
        throw new Error("User not authenticated");
      }
      return getInvoiceSettings(ctx.user.id);
    },
  },

  Mutation: {
    updateInvoiceSettings: (
      _parent: unknown,
      { input }: { input: any },
      ctx: GraphQLContext
    ) => {
      requireOwnerOrAdmin(ctx);
      if (!ctx.user) {
        throw new Error("User not authenticated");
      }
      return updateInvoiceSettings(ctx.user.id, input);
    },
  },
};
