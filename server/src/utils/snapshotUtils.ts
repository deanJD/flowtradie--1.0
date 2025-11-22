// server/src/utils/snapshotUtils.ts

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/**
 * Fetches business snapshot for invoice creation.
 * Priority:
 * 1. InvoiceSettings (preferred)
 * 2. Business.address (fallback)
 */
export async function getBusinessSnapshot(businessId: string) {
  const business = await prisma.business.findUnique({
    where: { id: businessId },
    include: { address: true }, // fallback
  });

  const settings = await prisma.invoiceSettings.findUnique({
    where: { businessId },
  });

  if (!business) throw new Error("Business not found");

  // Preferred: InvoiceSettings
  const snapshot = {
    businessName: settings?.businessName ?? business.name,
    abn: settings?.abn ?? business.registrationNumber,
    phone: settings?.phone ?? business.phone,
    email: settings?.email ?? business.email,
    website: settings?.website ?? business.website,
    logoUrl: settings?.logoUrl ?? business.logoUrl,
    bankDetails: settings?.bankDetails ?? null,
    address:
      settings?.addressSnapshot ??
      (business.address
        ? {
            line1: business.address.line1,
            line2: business.address.line2,
            city: business.address.city,
            state: business.address.state,
            postcode: business.address.postcode,
            country: business.address.country,
            countryCode: business.address.countryCode,
          }
        : null),
  };

  return snapshot;
}

/**
 * Fetches client snapshot for invoice creation.
 * Optional: pass selected addressId (job site) — otherwise use first address.
 */
export async function getClientSnapshot(clientId: string, addressId?: string) {
  const client = await prisma.client.findUnique({
    where: { id: clientId },
    include: { addresses: true },
  });

  if (!client) throw new Error("Client not found");

  // If user selects address (job/site) → use it
  const selectedAddress =
    (addressId && client.addresses.find((a) => a.id === addressId)) ||
    client.addresses[0] || // fallback to first
    null;

  return {
    firstName: client.firstName,
    lastName: client.lastName,
    businessName: client.businessName,
    phone: client.phone,
    email: client.email,
    address: selectedAddress
      ? {
          line1: selectedAddress.line1,
          line2: selectedAddress.line2,
          city: selectedAddress.city,
          state: selectedAddress.state,
          postcode: selectedAddress.postcode,
          country: selectedAddress.country,
          countryCode: selectedAddress.countryCode,
        }
      : null,
  };
}
