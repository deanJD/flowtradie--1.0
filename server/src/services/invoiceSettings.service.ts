// server/src/services/invoiceSettings.service.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ✅ Always return the first and only settings row
export async function getInvoiceSettings() {
  return prisma.invoiceSettings.findFirst();
}

// ✅ Always update the one-and-only settings row
export async function updateInvoiceSettings(input: any) {
  let settings = await prisma.invoiceSettings.findFirst();

  if (!settings) {
    settings = await prisma.invoiceSettings.create({
      data: {},
    });
  }

  return prisma.invoiceSettings.update({
    where: { id: settings.id },
    data: {
      businessName: input.businessName,
      abn: input.abn,
      addressLine1: input.addressLine1,
      addressLine2: input.addressLine2,
      city: input.city,
      state: input.state,
      postcode: input.postcode,
      country: input.country,

      phone: input.phone,
      email: input.email,
      website: input.website,
      logoUrl: input.logoUrl,
      bankDetails: input.bankDetails,

      invoicePrefix: input.invoicePrefix,
      startingNumber: input.startingNumber,
      defaultDueDays: input.defaultDueDays,
      gstRate: input.gstRate,

      smtpHost: input.smtpHost,
      smtpPort: input.smtpPort,
      smtpUser: input.smtpUser,
      smtpPassword: input.smtpPassword,
      fromEmail: input.fromEmail,
      fromName: input.fromName,
    },
  });
}
