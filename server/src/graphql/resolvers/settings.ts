import type { GraphQLContext } from "../../context.js";
import { requireOwnerOrAdmin } from "../../auth/authorize.js";
import { companySettingsService } from "../../services/companySettings.service.js";

export const settingsResolvers = {
  Query: {
    companySettings: (_parent: unknown, _args: unknown, ctx: GraphQLContext) => {
      return companySettingsService.get(ctx);
    },
  },
  Mutation: {
    updateCompanySettings: (
      _parent: unknown,
      { input }: { input: any },
      ctx: GraphQLContext
    ) => {
      requireOwnerOrAdmin(ctx);
      return companySettingsService.upsert(input, ctx);
    },
  },
};
