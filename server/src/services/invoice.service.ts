import { GraphQLContext } from "../context.js";
import { Prisma, InvoiceStatus } from "@prisma/client";
import { CreateInvoiceInput } from "@/__generated__/graphql.js";

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
    include: {
      items: true,
      payments: true,
      job: true 
    },
  });
},

  // # create invoice
  create: async (input: CreateInvoiceInput, ctx: GraphQLContext) => {
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

  // vvvvvvvvvv NEW FUNCTION ADDED BELOW vvvvvvvvvv
  createFromQuote: async (quoteId: string, ctx: GraphQLContext) => {
    // 1. Find the original quote and all its items
    const quote = await ctx.prisma.quote.findUnique({
      where: { id: quoteId },
      include: { items: true },
    });
  
    if (!quote) {
      throw new Error("Quote not found to create an invoice from.");
    }
    
    // 2. Prepare the data for the new invoice by copying from the quote
    // For now, we'll create a simple invoice number and set a due date 30 days from now.
    const newInvoiceNumber = `${quote.quoteNumber}-INV`;
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 30);
  
    // 3. Use a transaction to create the new invoice and update the old quote's status
    const newInvoice = await ctx.prisma.$transaction(async (prisma) => {
      // A) Create the new invoice with all its items
      const createdInvoice = await prisma.invoice.create({
        data: {
          jobId: quote.jobId,
          invoiceNumber: newInvoiceNumber,
          dueDate: dueDate,
          status: "DRAFT", // Start the new invoice as a Draft
          subtotal: quote.subtotal,
          gstRate: quote.gstRate,
          gstAmount: quote.gstAmount,
          totalAmount: quote.totalAmount,
          items: {
            create: quote.items.map(item => ({
              description: item.description,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              total: item.total,
            })),
          },
        },
        include: { items: true, job: true } // Return the full new invoice object
      });
  
      // B) Update the original quote's status to show it's been converted
      await prisma.quote.update({
        where: { id: quoteId },
        data: { status: "ACCEPTED" },
      });
  
      return createdInvoice;
    });
  
    return newInvoice;
  },
  // ^^^^^^^^^^ NEW FUNCTION ADDED ABOVE ^^^^^^^^^^

  // # [UPDATED] update invoice details
  update: async (id: string, input: UpdateInvoiceInput, ctx: GraphQLContext) => {
    const { items, ...invoiceDataWithNulls } = input;
    
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