import { GraphQLContext } from "../context.js";

export async function getInvoiceSettings(ctx: GraphQLContext) {
  if (!ctx.user?.businessId) throw new Error("Unauthorized");

  const business = await ctx.prisma.business.findUnique({
    where: { id: ctx.user.businessId },
    include: { 
      address: true, 
      region: true,
      invoiceSettings: true 
    },
  });

  if (!business) throw new Error("Business not found");

  const region = business.region;

  const settings = business.invoiceSettings || {
    bankDetails: "",
    invoicePrefix: "INV-",
    startingNumber: 1,
    defaultDueDays: 14,
    smtpHost: "",
    smtpPort: null,
    smtpUser: "",
    smtpPassword: "",
    fromEmail: "",
    fromName: "",
  };

  return {
    ...settings,
    businessId: business.id,

    // Business identity passthrough
    businessNumber: business.businessNumber,
    businessType: business.businessType,
    legalName: business.legalName,
    businessName: business.name,

    // Contact
    phone: business.phone,
    email: business.email,
    website: business.website,
    logoUrl: business.logoUrl,

    address: business.address,

    // TAX defaults now come from Region only 💥
    taxRate: Number(region.defaultTaxRate),
    taxLabel: region.taxLabel,
    currencyCode: region.currencyCode,
    currencySymbol: region.currencySymbol,
  };
}

export async function updateInvoiceSettings(input: any, ctx: GraphQLContext) {
  if (!ctx.user?.businessId) throw new Error("Unauthorized");
  const businessId = ctx.user.businessId;

  return ctx.prisma.$transaction(async (tx) => {
    // 1. Update Business identity
    await tx.business.update({
      where: { id: businessId },
      data: {
        name: input.businessName,
        legalName: input.legalName,
        businessNumber: input.businessNumber,
        businessType: input.businessType,
        phone: input.phone,
        email: input.email,
        website: input.website,
        logoUrl: input.logoUrl,

        address: input.address
          ? {
              upsert: {
                create: { ...input.address, addressType: "BUSINESS" },
                update: { ...input.address },
              },
            }
          : undefined,
      },
    });

    // 2. Update invoice numbering + banking settings
    await tx.invoiceSettings.upsert({
      where: { businessId },
      create: {
        businessId,
        bankDetails: input.bankDetails,
        invoicePrefix: input.invoicePrefix,
        startingNumber: input.startingNumber,
        defaultDueDays: input.defaultDueDays,
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
        smtpHost: input.smtpHost,
        smtpPort: input.smtpPort,
        smtpUser: input.smtpUser,
        smtpPassword: input.smtpPassword,
        fromEmail: input.fromEmail,
        fromName: input.fromName,
      },
    });

    return getInvoiceSettings(ctx);
  });
}
