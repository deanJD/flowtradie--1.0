// src/services/invoice.service.ts
import { GraphQLContext } from "../context.js";
import { InvoiceStatus } from "@prisma/client";

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
  gstRate?: number;
  items: CreateItemInput[];
}

export const invoiceService = {
  getById: (id: string, ctx: GraphQLContext) => {
    return ctx.prisma.invoice.findUnique({
      where: { id },
      include: { items: true, payments: true },
    });
  },

  create: async (input: CreateInvoiceInput, ctx: GraphQLContext) => {
    // 🧮 subtotal from items
    const subtotal = input.items.reduce((sum, item) => {
      const qty = item.quantity ?? 1;
      return sum + qty * item.unitPrice;
    }, 0);

    const gstRate = input.gstRate ?? 0.1;
    const gstAmount = subtotal * gstRate;
    const totalAmount = subtotal + gstAmount;

    return ctx.prisma.invoice.create({
      data: {
        invoiceNumber: input.invoiceNumber,
        dueDate: input.dueDate,
        status: input.status ?? "DRAFT",
        job: { connect: { id: input.jobId } },
        subtotal,
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

  update: async (id: string, input: Partial<CreateInvoiceInput>, ctx: GraphQLContext) => {
    let subtotal: number | undefined;
    let gstAmount: number | undefined;
    let totalAmount: number | undefined;

    if (input.items) {
      subtotal = input.items.reduce((sum, item) => {
        const qty = item.quantity ?? 1;
        return sum + qty * item.unitPrice;
      }, 0);

      const gstRate = input.gstRate ?? 0.1;
      gstAmount = subtotal * gstRate;
      totalAmount = subtotal + gstAmount;
    }

    return ctx.prisma.invoice.update({
      where: { id },
      data: {
        ...input,
        subtotal,
        gstRate: input.gstRate,
        gstAmount,
        totalAmount,
        items: input.items
          ? {
              deleteMany: {}, // clear old
              create: input.items.map((item) => ({
                description: item.description,
                quantity: item.quantity ?? 1,
                unitPrice: item.unitPrice,
                total: (item.quantity ?? 1) * item.unitPrice,
              })),
            }
          : undefined,
      },
      include: { items: true, payments: true },
    });
  },
};
