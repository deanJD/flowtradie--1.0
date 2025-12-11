// server/src/graphql/resolvers/invoiceSettings.ts
import { MutationUpdateInvoiceSettingsArgs } from "@/__generated__/graphql.js";
import { GraphQLContext } from "../../context.js";
import { getInvoiceSettings, updateInvoiceSettings } from "../../services/invoiceSettings.service.js";

function decimalToNumber(val: any): number | null {
  if (val === null || val === undefined) return null;
  return typeof val === "number" ? val : val.toNumber?.() ?? null;
}

export const invoiceSettingsResolvers = {
  Query: {
    invoiceSettings: async (_p: unknown, _args: unknown, ctx: GraphQLContext) => {
      const result = await getInvoiceSettings(ctx);
      if (!result) return null;

      // Ensure decimals are converted for GraphQL Float
      return {
        ...result,
        taxRate: decimalToNumber(result.taxRate),
      };
    },
  },

  Mutation: {
    updateInvoiceSettings: async (
      _parent: unknown,
      { input }: MutationUpdateInvoiceSettingsArgs,
      ctx: GraphQLContext
    ) => {
      const result = await updateInvoiceSettings(input, ctx);
      
      return {
        ...result,
        taxRate: decimalToNumber(result.taxRate),
      };
    },
  },
};