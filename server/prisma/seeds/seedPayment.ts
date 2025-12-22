// prisma/seeds/seedPayment.ts

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();


// helper
function addDays(date: Date, days: number) {
  return new Date(date.getTime() + days * 86400000);
}

export default async function seedPayment() {
  const business = await prisma.business.findFirst();
  if (!business) throw new Error("Business missing");

  const invoices = await prisma.invoice.findMany({
    include: { client: true },
  });

  console.log(`🌱 Seeding payments...`);

  const paymentsData: any[] = [];

  for (const invoice of invoices) {
    // only process invoices marked paid
    if (invoice.status === "PAID") {
      paymentsData.push({
        businessId: invoice.businessId,
        clientId: invoice.clientId,
        invoiceId: invoice.id,

        amount: invoice.totalAmount,
        date: addDays(invoice.issueDate, 7),

        method: "Bank Transfer",
        notes: "Seeded payment",
      });
    }
  }

  if (paymentsData.length > 0) {
    await prisma.payment.createMany({
      data: paymentsData,
    });
  }

  console.log(`   ➤ Seeded ${paymentsData.length} payments`);
}
