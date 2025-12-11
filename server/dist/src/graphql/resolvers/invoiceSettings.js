import { getInvoiceSettings, updateInvoiceSettings } from "../../services/invoiceSettings.service.js";
function decimalToNumber(val) {
    if (val === null || val === undefined)
        return null;
    return typeof val === "number" ? val : val.toNumber?.() ?? null;
}
export const invoiceSettingsResolvers = {
    Query: {
        invoiceSettings: async (_p, _args, ctx) => {
            const result = await getInvoiceSettings(ctx);
            if (!result)
                return null;
            // Ensure decimals are converted for GraphQL Float
            return {
                ...result,
                taxRate: decimalToNumber(result.taxRate),
            };
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