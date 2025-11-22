// server/src/graphql/resolvers/invoiceSettings.ts
import { getInvoiceSettings, updateInvoiceSettings, } from "../../services/invoiceSettings.service.js";
// 👉 Correct resolver structure using generated type
export const invoiceSettingsResolvers = {
    Query: {
        invoiceSettings: async (_parent, _args, _ctx) => {
            return getInvoiceSettings();
        },
    },
    Mutation: {
        updateInvoiceSettings: async (_parent, { input }, _ctx) => {
            return updateInvoiceSettings(input);
        },
    },
};
//# sourceMappingURL=invoiceSettings.js.map