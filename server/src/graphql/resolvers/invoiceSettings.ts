// server/src/graphql/resolvers/invoiceSettings.ts

import { GraphQLContext } from "../../context.js";
import {
  getInvoiceSettings,
  updateInvoiceSettings,
} from "../../services/invoiceSettings.service.js";

// 👉 Import types from generated file
import {
  Resolvers,
  MutationUpdateInvoiceSettingsArgs,
} from "../../__generated__/graphql.js";

// 👉 Correct resolver structure using generated type
export const invoiceSettingsResolvers: Resolvers = {
  Query: {
    invoiceSettings: async (
      _parent,
      _args,
      _ctx: GraphQLContext
    ) => {
      return getInvoiceSettings();
    },
  },

  Mutation: {
    updateInvoiceSettings: async (
      _parent,
      { input }: MutationUpdateInvoiceSettingsArgs,
      _ctx: GraphQLContext
    ) => {
      return updateInvoiceSettings(input);
    },
  },
};
