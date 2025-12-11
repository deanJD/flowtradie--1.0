export async function getInvoiceSettings(ctx) {
    if (!ctx.user?.businessId)
        throw new Error("Unauthorized");
    // 1. Fetch Business (Identity) AND Settings (Config)
    const business = await ctx.prisma.business.findUnique({
        where: { id: ctx.user.businessId },
        include: { address: true, invoiceSettings: true },
    });
    if (!business)
        throw new Error("Business not found");
    // 2. Create defaults if settings don't exist yet
    const defaults = {
        id: "pending",
        invoicePrefix: "INV-",
        startingNumber: 1000,
        defaultDueDays: 14,
        taxRate: 0.1,
        taxLabel: "GST",
        bankDetails: "",
        smtpHost: "",
        smtpPort: null,
        smtpUser: "",
        smtpPassword: "",
        fromEmail: "",
        fromName: "",
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    const settings = business.invoiceSettings || defaults;
    // 3. MERGE return object
    return {
        // 👈 FIX: Spread FIRST to establish base values (including 'id')
        ...settings,
        // 👇 NOW override with specific logic (This is safe)
        businessId: business.id,
        // Identity (Force these from Business Table)
        businessName: business.name,
        abn: business.registrationNumber,
        phone: business.phone,
        email: business.email,
        website: business.website,
        logoUrl: business.logoUrl,
        // Address (Force from Business Table)
        address: business.address,
        // Safety check: Handle both Prisma Decimal and plain Number
        taxRate: settings.taxRate ? Number(settings.taxRate) : 0.1,
    };
}
export async function updateInvoiceSettings(input, ctx) {
    if (!ctx.user?.businessId)
        throw new Error("Unauthorized");
    const businessId = ctx.user.businessId;
    return ctx.prisma.$transaction(async (tx) => {
        // 1. Update Identity (Business Table)
        await tx.business.update({
            where: { id: businessId },
            data: {
                name: input.businessName,
                registrationNumber: input.abn,
                phone: input.phone,
                email: input.email,
                website: input.website,
                logoUrl: input.logoUrl,
                // Handle Address Relation
                address: input.address ? {
                    upsert: {
                        create: { ...input.address, addressType: "BUSINESS" },
                        update: { ...input.address }
                    }
                } : undefined
            },
        });
        // 2. Update Configuration (InvoiceSettings Table)
        // We remove the identity fields from 'input' before saving to settings
        const settings = await tx.invoiceSettings.upsert({
            where: { businessId },
            create: {
                businessId,
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
            update: {
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
        // Return the merged result so the frontend updates instantly
        return getInvoiceSettings(ctx);
    });
}
//# sourceMappingURL=invoiceSettings.service.js.map