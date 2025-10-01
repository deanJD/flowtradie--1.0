import { GraphQLContext } from "../context.js";
import { Prisma, InvoiceStatus } from "@prisma/client";
import { CreateInvoiceInput } from "../__generated__/graphql.js"; // <-- NEW: Import for type safety

// This helper type for the update function is correct
type UpdateInvoiceInput = {
  invoiceNumber?: string | null;
  dueDate?: Date | null;
  status?: InvoiceStatus | null;
  items?: {
    description: string;
    quantity?: number | null;
    unitPrice: number;
  }[] | null;
  gstRate?: number | null;
};


export const invoiceService = {
  // # returns invoices for a job
  getAllByJob: async (jobId: string | undefined, ctx: GraphQLContext) => {
    const invoices = await ctx.prisma.invoice.findMany({
      where: jobId ? { jobId } : {},
      include: { items: true, payments: true },
    });
    return invoices || [];
  },

  // # fetch single invoice
  getById: async (id: string, ctx: GraphQLContext) => {
    return await ctx.prisma.invoice.findUnique({
      where: { id },
      include: { items: true, payments: true },
    });
  },

  // # create invoice
  create: async (input: CreateInvoiceInput, ctx: GraphQLContext) => { // <-- CHANGED from 'any'
    const subtotal = input.items.reduce(
      (sum: number, i: any) => sum + (i.quantity ?? 1) * i.unitPrice,
      0
    );
    const gstRate = input.gstRate ?? 0.1;
    const gstAmount = subtotal * gstRate;
    const totalAmount = subtotal + gstAmount;

    return ctx.prisma.invoice.create({
      data: {
        jobId: input.jobId,
        invoiceNumber: input.invoiceNumber,
        dueDate: input.dueDate,
        status: input.status ?? "DRAFT",
        subtotal,
        gstRate,
        gstAmount,
        totalAmount,
        items: {
          create: input.items.map((i: any) => ({
            description: i.description,
            quantity: i.quantity ?? 1,
            unitPrice: i.unitPrice,
            total: (i.quantity ?? 1) * i.unitPrice,
          })),
        },
      },
      include: { items: true, payments: true },
    });
  },

  // # [UPDATED] update invoice details
  update: async (id: string, input: UpdateInvoiceInput, ctx: GraphQLContext) => {
    const { items, ...invoiceDataWithNulls } = input;
    
    // Convert any 'null' values to 'undefined' so Prisma ignores them.
    const invoiceData: Prisma.InvoiceUpdateInput = {
      invoiceNumber: invoiceDataWithNulls.invoiceNumber ?? undefined,
      dueDate: invoiceDataWithNulls.dueDate ?? undefined,
      status: invoiceDataWithNulls.status ?? undefined,
      gstRate: invoiceDataWithNulls.gstRate ?? undefined,
    };

    return await ctx.prisma.$transaction(async (prisma) => {
      const updatedInvoice = await prisma.invoice.update({
        where: { id },
        data: invoiceData,
      });

      if (items) {
        await prisma.invoiceItem.deleteMany({ where: { invoiceId: id } });
        await prisma.invoiceItem.createMany({
          data: items.map((item) => ({
            invoiceId: id,
            description: item.description,
            quantity: item.quantity ?? 1,
            unitPrice: item.unitPrice,
            total: (item.quantity ?? 1) * item.unitPrice,
          })),
        });
      }

      const currentItems = await prisma.invoiceItem.findMany({ where: { invoiceId: id } });
      const subtotal = currentItems.reduce((sum, i) => sum + i.total, 0);
      const gstRate = updatedInvoice.gstRate;
      const gstAmount = subtotal * gstRate;
      const totalAmount = subtotal + gstAmount;

      return await prisma.invoice.update({
        where: { id },
        data: { subtotal, gstAmount, totalAmount },
        include: { items: true, payments: true },
      });
    });
  },

  // # delete invoice by ID
  delete: async (id: string, ctx: GraphQLContext) => {
    return await ctx.prisma.invoice.delete({ where: { id } });
  },
};