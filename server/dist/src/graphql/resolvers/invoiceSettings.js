// server/src/graphql/resolvers/invoiceSettings.ts
import { getInvoiceSettings, updateInvoiceSettings, } from "../../services/invoiceSettings.service.js";
function decimalToNumber(val) {
    if (val === null || val === undefined)
        return null;
    return typeof val === "number" ? val : val.toNumber?.() ?? null;
}
export const invoiceSettingsResolvers = {
    Query: {
        invoiceSettings: async (_p, _args, ctx) => {
            const result = await getInvoiceSettings(ctx);
            return result ? { ...result, taxRate: decimalToNumber(result.taxRate) } : null;
        },
    },
    Mutation: {
        updateInvoiceSettings: async (_parent, { input }, ctx) => {
            const result = await updateInvoiceSettings(input, ctx);
            return {
                ...result,
                taxRate: decimalToNumber(result.taxRate),
            };
        },
    },
};
//# sourceMappingURL=invoiceSettings.js.map