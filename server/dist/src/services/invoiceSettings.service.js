// server/src/services/invoiceSettings.service.ts
// server/src/services/invoiceSettings.service.ts
export async function getInvoiceSettings(ctx) {
    if (!ctx.user?.businessId) {
        const fallbackBusiness = await ctx.prisma.business.findFirst();
        if (!fallbackBusiness)
            throw new Error("No business found.");
        // 🔥 FIX – MUST INCLUDE `email`
        ctx.user = {
            id: "TEST",
            email: "test@flowtradie.com", // 👈 ADD THIS
            role: "OWNER",
            businessId: fallbackBusiness.id,
        };
    }
    if (!ctx.user?.businessId)
        throw new Error("No businessId found for user.");
    return ctx.prisma.invoiceSettings.findUnique({
        where: { businessId: ctx.user.businessId },
    });
}
export async function updateInvoiceSettings(input, ctx) {
    if (!ctx.user?.businessId)
        throw new Error("Unauthorized");
    const businessId = ctx.user.businessId;
    return ctx.prisma.invoiceSettings.upsert({
        where: { businessId },
        create: {
            businessId,
            businessName: input.businessName,
            abn: input.abn,
            phone: input.phone,
            email: input.email,
            website: input.website,
            logoUrl: input.logoUrl,
            bankDetails: input.bankDetails,
            invoicePrefix: input.invoicePrefix,
            startingNumber: input.startingNumber,
            defaultDueDays: input.defaultDueDays,
            // 🔥 TAX SYSTEM — correct naming
            taxRate: input.taxRate, // NOT gstRate
            taxLabel: input.taxLabel, // NEW
            smtpHost: input.smtpHost,
            smtpPort: input.smtpPort,
            smtpUser: input.smtpUser,
            smtpPassword: input.smtpPassword,
            fromEmail: input.fromEmail,
            fromName: input.fromName,
        },
        update: {
            businessName: input.businessName,
            abn: input.abn,
            phone: input.phone,
            email: input.email,
            website: input.website,
            logoUrl: input.logoUrl,
            bankDetails: input.bankDetails,
            invoicePrefix: input.invoicePrefix,
            startingNumber: input.startingNumber,
            defaultDueDays: input.defaultDueDays,
            taxRate: input.taxRate,
            taxLabel: input.taxLabel,
            smtpHost: input.smtpHost,
            smtpPort: input.smtpPort,
            smtpUser: input.smtpUser,
            smtpPassword: input.smtpPassword,
            fromEmail: input.fromEmail,
            fromName: input.fromName,
        },
    });
}
//# sourceMappingURL=invoiceSettings.service.js.map