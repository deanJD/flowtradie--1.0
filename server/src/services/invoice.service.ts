// server/src/services/invoice.service.ts
import { GraphQLContext } from "../context.js";
import { Prisma, InvoiceStatus } from "@prisma/client";
import { CreateInvoiceInput, UpdateInvoiceInput, CreateInvoiceItemInput } from "@/__generated__/graphql.js";

// Helper to calculate totals based on items
const calculateInvoiceTotals = (
    items: ({ quantity?: number | null; unitPrice: number })[],
    gstRate: number | null | undefined // Accept null/undefined
) => {
    const rate = gstRate ?? 0.1; // Default inside helper
    const subtotal = items.reduce((sum, item) => sum + ((item.quantity ?? 1) * item.unitPrice), 0);
    const gstAmount = subtotal * rate;
    const totalAmount = subtotal + gstAmount;
    return { subtotal, gstAmount, totalAmount };
};


export const invoiceService = {
  // --- Get All Invoices ---
  getAll: async (projectId: string | undefined, ctx: GraphQLContext) => {
    const where: Prisma.InvoiceWhereInput = { deletedAt: null };
    if (projectId) { where.projectId = projectId; }
    return await ctx.prisma.invoice.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        items: { select: { id: true } },
        payments: { where: { deletedAt: null }, select: { amount: true } },
        project: { include: { client: { select: { id: true, name: true } } } }
      },
    });
  },

  // --- Get Single Invoice by ID ---
  getById: async (id: string, ctx: GraphQLContext) => {
    return await ctx.prisma.invoice.findFirst({
      where: { id, deletedAt: null },
      include: {
        items: true,
        payments: { where: { deletedAt: null }, orderBy: { date: 'asc' } },
        project: { include: { client: true } },
      },
    });
  },

  // --- Create New Invoice ---
  create: async (input: CreateInvoiceInput, ctx: GraphQLContext) => {
    const { projectId, items, gstRate, status, ...restInput } = input; // Destructure all expected fields explicitly

    const currentGstRate = gstRate ?? 0.1; // Use provided or default
    const currentStatus = status ?? InvoiceStatus.DRAFT; // Use provided or default

    const totals = calculateInvoiceTotals(items, currentGstRate);

    const itemsData = items.map((i) => ({
        description: i.description,
        quantity: i.quantity ?? 1,
        unitPrice: i.unitPrice,
        total: (i.quantity ?? 1) * i.unitPrice,
    }));

    // Ensure all required fields from CreateInvoiceInput are included
    return ctx.prisma.invoice.create({
      data: {
        ...restInput, // Includes invoiceNumber, dueDate, issueDate, notes
        projectId: projectId,
        gstRate: currentGstRate,
        status: currentStatus,
        ...totals,
        items: {
          createMany: {
            data: itemsData,
          },
        },
      },
      include: {
        items: true,
        project: { include: { client: true } } ,
        payments: true
      },
    });
  },

  // --- Create Invoice From Existing Quote ---
  createFromQuote: async (quoteId: string, ctx: GraphQLContext) => {
    const quote = await ctx.prisma.quote.findFirst({
      where: { id: quoteId, deletedAt: null },
      include: { items: true, project: true },
    });
    if (!quote || !quote.project) throw new Error("Quote or associated project not found.");

    const newInvoiceNumber = `INV-${quote.quoteNumber}`;
    const issueDate = new Date();
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 30);

    return await ctx.prisma.$transaction(async (prismaTX) => { // Use prismaTX
      const createdInvoice = await prismaTX.invoice.create({ // *** FIX: Use prismaTX here ***
        data: {
          projectId: quote.projectId,
          invoiceNumber: newInvoiceNumber,
          issueDate: issueDate,
          dueDate: dueDate,
          // notes: quote.notes,
          status: InvoiceStatus.DRAFT,
          subtotal: quote.subtotal,
          gstRate: quote.gstRate,
          gstAmount: quote.gstAmount,
          totalAmount: quote.totalAmount,
          items: {
            createMany: {
              data: quote.items.map(item => ({
                description: item.description,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                total: item.total,
              })),
            },
          },
        },
        include: { items: true, project: { include: { client: true } }, payments: true }
      });

      // Use prismaTX
      // await prismaTX.quote.update({ where: { id: quoteId }, data: { status: "ACCEPTED" } }); // Assuming QuoteStatus enum exists or use string

      return createdInvoice;
    });
  },

  // --- Update Existing Invoice ---
  update: async (id: string, input: UpdateInvoiceInput, ctx: GraphQLContext) => {
    return await ctx.prisma.$transaction(async (prismaTX) => {
      const { items, ...invoiceDataInput } = input;

      const invoiceData: Prisma.InvoiceUpdateInput = {};
      // Explicitly check for null/undefined before adding to update object
      if (invoiceDataInput.invoiceNumber !== undefined && invoiceDataInput.invoiceNumber !== null) invoiceData.invoiceNumber = invoiceDataInput.invoiceNumber;
      if (invoiceDataInput.dueDate !== undefined && invoiceDataInput.dueDate !== null) invoiceData.dueDate = invoiceDataInput.dueDate;
      if (invoiceDataInput.status !== undefined && invoiceDataInput.status !== null) invoiceData.status = invoiceDataInput.status;
      if (invoiceDataInput.gstRate !== undefined && invoiceDataInput.gstRate !== null) invoiceData.gstRate = invoiceDataInput.gstRate;
      // Add issueDate/notes if they become part of UpdateInvoiceInput schema
      // if (invoiceDataInput.issueDate !== undefined && invoiceDataInput.issueDate !== null) invoiceData.issueDate = invoiceDataInput.issueDate;
      // if (invoiceDataInput.notes !== undefined && invoiceDataInput.notes !== null) invoiceData.notes = invoiceDataInput.notes;


      let updatedInvoice = await prismaTX.invoice.update({
        where: { id },
        data: invoiceData,
      });

      if (items !== undefined && items !== null) {
        await prismaTX.invoiceItem.deleteMany({ where: { invoiceId: id } });
        if (items.length > 0) {
            const itemsData = items.map((item) => ({
                invoiceId: id,
                description: item.description,
                quantity: item.quantity ?? 1,
                unitPrice: item.unitPrice,
                total: (item.quantity ?? 1) * item.unitPrice,
            }));
            await prismaTX.invoiceItem.createMany({
              data: itemsData,
            });
        }
      }

      const currentItems = await prismaTX.invoiceItem.findMany({ where: { invoiceId: id } });
      const currentGstRate = updatedInvoice.gstRate;
      // Use the corrected helper function signature
      const totals = calculateInvoiceTotals(currentItems, currentGstRate);

      // *** FIX: Correct update call with data and where ***
      updatedInvoice = await prismaTX.invoice.update({
        where: { id }, // Provide the 'where' clause
        data: {      // Provide the 'data' clause
            subtotal: totals.subtotal,
            gstAmount: totals.gstAmount,
            totalAmount: totals.totalAmount
        },
        include: { items: true, payments: { where: { deletedAt: null }, orderBy: { date: 'asc' } }, project: { include: { client: true } } },
      });

      return updatedInvoice;
    });
  },

  // --- Soft Delete Invoice ---
  delete: async (id: string, ctx: GraphQLContext) => {
    return await ctx.prisma.invoice.update({
      where: { id },
      data: { deletedAt: new Date() },
      select: { id: true }
    });
  },
};

