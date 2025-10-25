import { requireOwnerOrAdmin } from "../../auth/authorize.js";
import { companySettingsService } from "../../services/companySettings.service.js";
export const settingsResolvers = {
    Query: {
        companySettings: (_parent, _args, ctx) => {
            return companySettingsService.get(ctx);
        },
    },
    Mutation: {
        updateCompanySettings: (_parent, { input }, ctx) => {
            requireOwnerOrAdmin(ctx);
            return companySettingsService.upsert(input, ctx);
        },
    },
};
//# sourceMappingURL=settings.js.map