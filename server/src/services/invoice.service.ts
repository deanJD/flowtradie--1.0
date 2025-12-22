// server/src/services/invoice.service.ts
import { GraphQLContext } from "../context.js";
import { Prisma, InvoiceStatus } from "@prisma/client";
import {
  CreateInvoiceInput,
  UpdateInvoiceInput,
} from "@/__generated__/graphql.js";

/* -------------------------------------------------------
   Helpers
------------------------------------------------------- */

const calcTotals = (
  items: { quantity?: number | null; unitPrice: number }[],
  rate: number
) => {
  const subtotal = items.reduce(
    (sum, item) => sum + ((item.quantity ?? 1) * item.unitPrice),
    0
  );
  const taxAmount = subtotal * rate;
  const totalAmount = subtotal + taxAmount;
  return { subtotal, taxAmount, totalAmount };
};

/* -------------------------------------------------------
   Invoice Service
------------------------------------------------------- */

export const invoiceService = {
  /* ----------------------------
     Get All Invoices
  ---------------------------- */
 getAll: async (businessId: string | undefined, ctx: GraphQLContext) => {
  const where: Prisma.InvoiceWhereInput = { deletedAt: null };
  if (businessId) where.businessId = businessId;


    return ctx.prisma.invoice.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        items: true,
        payments: { where: { deletedAt: null }, orderBy: { date: "asc" } },
        project: { include: { client: true } },
      },
    });
  },

  /* ----------------------------
     Get Single Invoice
  ---------------------------- */
  getById: async (id: string, ctx: GraphQLContext) => {
    return ctx.prisma.invoice.findFirst({
      where: { id, deletedAt: null },
      include: {
        items: true,
        payments: { where: { deletedAt: null }, orderBy: { date: "asc" } },
        project: { include: { client: true } },
      },
    });
  },

  /* -------------------------------------------------------
     Create Invoice (region-snapshot defaults)
  ------------------------------------------------------- */
  /* -------------------------------------------------------
   Create Invoice (region snapshot defaults)
------------------------------------------------------- */
create: async (input: CreateInvoiceInput, ctx: GraphQLContext) => {
  const {
    projectId,
    clientId: inputClientId,
    clientAddressId,
    items,
    issueDate,
    dueDate,
    notes,
  } = input as any;

  return ctx.prisma.$transaction(async (tx) => {
    // 1️⃣ load project -> derive business + region
    const project = await tx.project.findUnique({
      where: { id: projectId },
      include: {
        client: { include: { addresses: true } },
        business: {
          include: {
            address: true,
            region: true,
            invoiceSettings: true,
          },
        },
      },
    });

    if (!project) throw new Error("Project not found");

    const business = project.business;
    const region = business.region;
    let settings = business.invoiceSettings;

    const businessId = business.id;
    const clientId = project.clientId;

    if (inputClientId && inputClientId !== clientId) {
      throw new Error("Client does not belong to project");
    }

    // 2️⃣ ensure settings exist
    if (!settings) {
      settings = await tx.invoiceSettings.create({
        data: {
          businessId,
          startingNumber: 1,
          invoicePrefix: "INV-",
          defaultDueDays: 14,
        },
      });
    }

    // 3️⃣ invoice tax/currency snapshots
    const taxRate = Number(region.defaultTaxRate);
    const taxLabelSnapshot = region.taxLabel;
    const currencyCode = region.currencyCode;

    // 4️⃣ numbering
    const nextSeq = settings.startingNumber ?? 1;
    const prefix = settings.invoicePrefix ?? "INV-";
    const invoiceNumber = `${prefix}${String(nextSeq).padStart(4, "0")}`;

    await tx.invoiceSettings.update({
      where: { id: settings.id },
      data: { startingNumber: nextSeq + 1 },
    });

    // 5️⃣ date handling
    const now = new Date();
    const finalIssueDate = issueDate ?? now;

    const defaultDueDays = settings.defaultDueDays ?? 14;
    const autoDue = new Date(finalIssueDate.getTime());
    autoDue.setDate(autoDue.getDate() + defaultDueDays);
    const finalDueDate = dueDate ?? autoDue;

    // 6️⃣ items + totals
    const itemsData = items.map(
      (i: { description: string; quantity?: number | null; unitPrice: number }) => ({
        description: i.description,
        quantity: i.quantity ?? 1,
        unitPrice: i.unitPrice,
        total: (i.quantity ?? 1) * i.unitPrice,
      })
    );

    const { subtotal, taxAmount, totalAmount } = calcTotals(itemsData, taxRate);

    // 7️⃣ business snapshot JSON
    const businessSnapshot = {
      businessName: business.name,
      legalName: business.legalName,
      businessNumber: business.businessNumber,
      businessType: business.businessType,
      phone: business.phone,
      email: business.email,
      website: business.website,
      logoUrl: business.logoUrl,
      bankDetails: settings.bankDetails,
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
      region: {
        code: region.code,
        name: region.name,
        currencyCode: region.currencyCode,
        currencySymbol: region.currencySymbol,
        taxLabel: region.taxLabel,
      },
    };

    // 8️⃣ client snapshot JSON
    const clientSnapshot = {
      id: project.client.id,
      firstName: project.client.firstName,
      lastName: project.client.lastName,
      businessName: project.client.businessName,
      phone: project.client.phone,
      email: project.client.email,
      type: project.client.type,
      address: project.client.addresses?.[0] ?? null,
      clientAddressId: clientAddressId ?? null,
    };

    // 9️⃣ persist invoice with region snapshot
    const invoice = await tx.invoice.create({
      data: {
        projectId,
        businessId,
        clientId,

        invoicePrefix: prefix,
        invoiceSequence: nextSeq,
        invoiceNumber,

        issueDate: finalIssueDate,
        dueDate: finalDueDate,
        notes: notes ?? null,
        status: InvoiceStatus.DRAFT,

        taxRate,
        taxLabelSnapshot,
        currencyCode,

        subtotal,
        taxAmount,
        totalAmount,

        businessSnapshot,
        clientSnapshot,

        items: {
          create: itemsData,
        },
      },
      include: {
        items: true,
        payments: { where: { deletedAt: null }, orderBy: { date: "asc" } },
        project: { include: { client: true } },
      },
    });

    return invoice;
  });
},


  /* ----------------------------
     Update Invoice (simple patch)
  ---------------------------- */
  update: async (id: string, input: UpdateInvoiceInput, ctx: GraphQLContext) => {
    // Remove any keys with null values, since Prisma does not accept null for non-nullable fields
    const filteredInput = Object.fromEntries(
      Object.entries(input).filter(([_, v]) => v !== null)
    );
    return ctx.prisma.invoice.update({
      where: { id },
      data: filteredInput,
    });
  },

  /* ----------------------------
     Soft Delete
  ---------------------------- */
  delete: async (id: string, ctx: GraphQLContext) => {
    return ctx.prisma.invoice.update({
      where: { id },
      data: { deletedAt: new Date() },
      select: { id: true },
    });
  },
};
