// prisma/seeds/seedInvoice.ts

// node16 / nodenext needs .js extension
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// simple timestamp helpers
function addDays(date: Date, days: number) {
  return new Date(date.getTime() + days * 86400000);
}

function subDays(date: Date, days: number) {
  return new Date(date.getTime() - days * 86400000);
}

export default async function seedInvoice() {
  const business = await prisma.business.findFirst();
  if (!business) throw new Error("Business missing");

  const projects = await prisma.project.findMany({
    include: { client: true },
  });

  console.log(`🌱 Seeding invoices for ${projects.length} projects...`);

  let sequence = 1;
  const invoicesData: any[] = [];

  for (const project of projects) {
    const numInvoices = Math.random() > 0.5 ? 2 : 1;

    for (let i = 0; i < numInvoices; i++) {
      const subtotal = Number((Math.random() * 1200 + 300).toFixed(2)); // $300–1500
      const taxRate = 0.10;
      const taxAmount = Number((subtotal * taxRate).toFixed(2));
      const totalAmount = subtotal + taxAmount;

      const issueDate = subDays(new Date(), Math.floor(Math.random() * 30));
      const dueDate = addDays(issueDate, 14);

      invoicesData.push({
        businessId: business.id,
        projectId: project.id,
        clientId: project.clientId,

        invoicePrefix: "FT",
        invoiceSequence: sequence,
        invoiceNumber: `FT-${sequence.toString().padStart(4, "0")}`,
        sequence: sequence,

        status:
          Math.random() > 0.6
            ? "PAID"
            : Math.random() > 0.3
            ? "SENT"
            : "DRAFT",

        issueDate,
        dueDate,

        subtotal,
        taxRate,
        taxLabelSnapshot: "GST",
        taxAmount,
        totalAmount,
        currencyCode: "AUD",

        businessSnapshot: business,
        clientSnapshot: {
          id: project.client.id,
          name: project.client.businessName ?? project.client.firstName,
        },

        notes: "Seeded invoice",
      });

      sequence++;
    }
  }

  if (invoicesData.length > 0) {
    await prisma.invoice.createMany({
      data: invoicesData,
    });
  }

  console.log(`   ➤ Seeded ${invoicesData.length} invoices`);
}
