import { PrismaClient, Invoice, InvoiceStatus } from "@prisma/client";
import { GraphQLContext } from "../context.js";

interface CreateItemInput {
  description: string;
  quantity?: number;
  unitPrice: number;
}

interface CreateInvoiceInput {
  jobId: string;
  invoiceNumber: string;
  dueDate: Date;
  status?: InvoiceStatus;
  items: CreateItemInput[];
  subtotal: number;
  gstRate?: number;
}

interface UpdateInvoiceInput {
  invoiceNumber?: string;
  dueDate?: Date;
  status?: InvoiceStatus;
  subtotal?: number;
  gstRate?: number;
}

export const invoiceService = {
  getById: (id: string, ctx: GraphQLContext): Promise<Invoice | null> => {
    return ctx.prisma.invoice.findUnique({
      where: { id },
      include: { items: true, payments: true, job: true },
    });
  },

  create: async (input: CreateInvoiceInput, ctx: GraphQLContext) => {
    const gstRate = input.gstRate ?? 0.1;
    const gstAmount = input.subtotal * gstRate;
    const totalAmount = input.subtotal + gstAmount;

    return ctx.prisma.invoice.create({
      data: {
        jobId: input.jobId,
        invoiceNumber: input.invoiceNumber,
        dueDate: input.dueDate,
        status: input.status ?? "DRAFT",
        subtotal: input.subtotal,
        gstRate,
        gstAmount,
        totalAmount,
        items: {
          create: input.items.map((item) => ({
            description: item.description,
            quantity: item.quantity ?? 1,
            unitPrice: item.unitPrice,
            total: (item.quantity ?? 1) * item.unitPrice,
          })),
        },
      },
      include: { items: true, payments: true },
    });
  },

  update: async (id: string, input: UpdateInvoiceInput, ctx: GraphQLContext) => {
    const existing = await ctx.prisma.invoice.findUnique({ where: { id } });
    if (!existing) throw new Error("Invoice not found");

    const baseSubtotal = input.subtotal ?? existing.subtotal;
    const baseRate = input.gstRate ?? existing.gstRate;
    const gstAmount = baseSubtotal * baseRate;
    const totalAmount = baseSubtotal + gstAmount;

    return ctx.prisma.invoice.update({
      where: { id },
      data: {
        ...input,
        gstAmount,
        totalAmount,
      },
      include: { items: true, payments: true },
    });
  },
};
