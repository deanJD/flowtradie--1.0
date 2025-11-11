import { getInvoiceSettings, updateInvoiceSettings, } from "../../services/invoiceSettings.service.js";
export const invoiceSettingsResolvers = {
    Query: {
        invoiceSettings: async (_parent, _args, ctx) => {
            // ✅ No authentication required
            // Just return the first settings row in the DB
            return getInvoiceSettings();
        },
    },
    Mutation: {
        updateInvoiceSettings: async (_parent, { input }, ctx) => {
            // ✅ No authentication required
            // Always use the first settings record
            return updateInvoiceSettings(input);
        },
    },
};
//# sourceMappingURL=invoiceSettings.js.map