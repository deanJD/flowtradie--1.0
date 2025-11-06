// server/services/invoiceSettings.service.ts
import { PrismaClient, InvoiceSettings } from "@prisma/client";
const prisma = new PrismaClient();

// ✅ Whitelist of fields allowed in InvoiceSettingsInput
const allowedKeys: (keyof InvoiceSettings)[] = [
  "businessName",
  "abn",
  "address",
  "phone",
  "email",
  "website",
  "logoUrl",
  "bankDetails",
  "invoicePrefix",
  "startingNumber",
  "defaultDueDays",
  "gstRate",
  "smtpHost",
  "smtpPort",
  "smtpUser",
  "smtpPassword",
  "fromEmail",
  "fromName",
];

function cleanInput(input: any) {
  const out: any = {};
  for (const key of allowedKeys) {
    if (input[key] !== undefined) {
      out[key] = input[key];
    }
  }
  return out;
}

export const invoiceSettingsService = {
  async get(_ctx: any) {
    return prisma.invoiceSettings.findFirst();
  },

  async upsert(input: any, _ctx: any) {
    const data = cleanInput(input);

    // ✅ Convert GST rate (if it's > 1, make it fraction)
    if (typeof data.gstRate === "number" && data.gstRate > 1) {
      data.gstRate = data.gstRate / 100;
    }

    const existing = await prisma.invoiceSettings.findFirst();

    if (existing) {
      return prisma.invoiceSettings.update({
        where: { id: existing.id },
        data,
      });
    }

    return prisma.invoiceSettings.create({ data });
  },
};
