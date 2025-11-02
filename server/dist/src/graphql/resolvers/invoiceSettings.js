import { requireOwnerOrAdmin } from "../../auth/authorize.js";
import { invoiceSettingsService } from "../../services/invoiceSettings.service.js";
export const invoiceSettingsResolvers = {
    Query: {
        invoiceSettings: (_parent, _args, ctx) => {
            // Only allow authenticated users to read settings
            requireOwnerOrAdmin(ctx);
            return invoiceSettingsService.get(ctx);
        },
    },
    Mutation: {
        updateInvoiceSettings: (_parent, { input }, ctx) => {
            requireOwnerOrAdmin(ctx);
            return invoiceSettingsService.upsert(input, ctx);
        },
    },
};
//# sourceMappingURL=invoiceSettings.js.map