// src/services/quote.service.ts
import { Quote, QuoteStatus } from "@prisma/client";
import { GraphQLContext } from "../context.js";

interface CreateQuoteItemInput {
  description: string;
  quantity?: number;
  unitPrice: number;
}

interface CreateQuoteInput {
  jobId: string;
  quoteNumber: string;
  expiryDate?: Date;
  status?: QuoteStatus;
  items: CreateQuoteItemInput[];
  gstRate?: number; // default 10%
}

export const quoteService = {
  getAllByJob: (jobId: string, ctx: GraphQLContext): Promise<Quote[]> => {
    return ctx.prisma.quote.findMany({
      where: { jobId },
      include: { items: true },
      orderBy: { createdAt: "desc" },
    });
  },

  getById: (id: string, ctx: GraphQLContext): Promise<Quote | null> => {
    return ctx.prisma.quote.findUnique({
      where: { id },
      include: { items: true },
    });
  },

  create: async (input: CreateQuoteInput, ctx: GraphQLContext): Promise<Quote> => {
    // ✅ Calculate amounts before saving
    const subtotal = input.items.reduce(
      (sum, item) => sum + (item.quantity ?? 1) * item.unitPrice,
      0
    );
    const gstRate = input.gstRate ?? 0.1;
    const gstAmount = subtotal * gstRate;
    const totalAmount = subtotal + gstAmount;

    return ctx.prisma.quote.create({
      data: {
        jobId: input.jobId,
        quoteNumber: input.quoteNumber,
        expiryDate: input.expiryDate,
        status: input.status ?? "DRAFT",
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
      include: { items: true },
    });
  },

  update: async (
    id: string,
    input: Partial<CreateQuoteInput>,
    ctx: GraphQLContext
  ): Promise<Quote> => {
    const existing = await ctx.prisma.quote.findUnique({
      where: { id },
      include: { items: true },
    });
    if (!existing) throw new Error("Quote not found");

    // Recalculate if items or gstRate are changed
    const subtotal =
      input.items?.reduce(
        (sum, item) => sum + (item.quantity ?? 1) * item.unitPrice,
        0
      ) ?? existing.subtotal;

    const gstRate = input.gstRate ?? existing.gstRate;
    const gstAmount = subtotal * gstRate;
    const totalAmount = subtotal + gstAmount;

    return ctx.prisma.quote.update({
      where: { id },
      data: {
        quoteNumber: input.quoteNumber ?? existing.quoteNumber,
        expiryDate: input.expiryDate ?? existing.expiryDate,
        status: input.status ?? existing.status,
        subtotal,
        gstRate,
        gstAmount,
        totalAmount,
        ...(input.items && {
          items: {
            deleteMany: { quoteId: id },
            create: input.items.map((item) => ({
              description: item.description,
              quantity: item.quantity ?? 1,
              unitPrice: item.unitPrice,
              total: (item.quantity ?? 1) * item.unitPrice,
            })),
          },
        }),
      },
      include: { items: true },
    });
  },

  delete: (id: string, ctx: GraphQLContext): Promise<Quote> => {
    return ctx.prisma.quote.delete({ where: { id } });
  },
};
