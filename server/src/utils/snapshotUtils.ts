// server/src/utils/snapshotUtils.ts
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function getBusinessSnapshot(businessId: string) {
  const business = await prisma.business.findUnique({
    where: { id: businessId },
    include: { address: true },
  });

  const settings = await prisma.invoiceSettings.findUnique({
    where: { businessId },
  });

  if (!business) throw new Error("Business not found");

  // ✅ FIX: Single Source of Truth Logic
  const snapshot = {
    businessName: business.name,
    businessNumber: business.businessNumber,
    phone: business.phone,
    email: business.email,
    website: business.website,
    logoUrl: business.logoUrl,
    
    // Config only
    bankDetails: settings?.bankDetails ?? null,
    
    address: business.address
        ? {
            line1: business.address.line1,
            line2: business.address.line2,
            city: business.address.city,
            state: business.address.state,
            postcode: business.address.postcode,
            country: business.address.country,
            countryCode: business.address.countryCode,
          }
        : null,
  };

  return snapshot;
}

// ... getClientSnapshot stays the same