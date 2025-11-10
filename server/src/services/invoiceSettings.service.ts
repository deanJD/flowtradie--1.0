import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Fetch invoice settings for the current owner.
 * Ensures only settings belonging to the authenticated owner can be accessed.
 */
export async function getInvoiceSettings(ownerId: string) {
  return prisma.invoiceSettings.findFirst({
    where: { ownerId },
  });
}

/**
 * Create OR update invoice settings.
 * Automatically inserts row on first use.
 */
export async function updateInvoiceSettings(ownerId: string, input: any) {
  // Ensure settings row exists
  let settings = await prisma.invoiceSettings.findFirst({
    where: { ownerId },
  });

  if (!settings) {
    settings = await prisma.invoiceSettings.create({
      data: { ownerId },
    });
  }

  return prisma.invoiceSettings.update({
    where: { id: settings.id },
    data: {
      // Business info
      businessName: input.businessName,
      abn: input.abn,

      // ✅ Structured Address Fields
      addressLine1: input.addressLine1,
      addressLine2: input.addressLine2,
      city: input.city,
      state: input.state,
      postcode: input.postcode,
      country: input.country,

      // Contact + Branding
      phone: input.phone,
      email: input.email,
      website: input.website,
      logoUrl: input.logoUrl,
      bankDetails: input.bankDetails,

      // Invoice Formatting
      invoicePrefix: input.invoicePrefix,
      startingNumber: input.startingNumber,
      defaultDueDays: input.defaultDueDays,
      gstRate: input.gstRate,

      // Email Settings
      smtpHost: input.smtpHost,
      smtpPort: input.smtpPort,
      smtpUser: input.smtpUser,
      smtpPassword: input.smtpPassword,
      fromEmail: input.fromEmail,
      fromName: input.fromName,
    },
  });
}
