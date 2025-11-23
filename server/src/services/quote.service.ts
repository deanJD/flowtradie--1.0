import { GraphQLContext } from "../context.js";
import { Prisma } from "@prisma/client";
import { CreateQuoteInput, UpdateQuoteInput } from "@/__generated__/graphql.js";

export const quoteService = {
  getById: (id: string, ctx: GraphQLContext) => {
    return ctx.prisma.quote.findFirst({
      where: { id, deletedAt: null },
      include: { items: true, project: true },
    });
  },

  getByProject: (projectId: string, ctx: GraphQLContext) => {
    return ctx.prisma.quote.findMany({
      where: { projectId, deletedAt: null },
      include: { items: true, project: true },
    });
  },

  create: async (input: CreateQuoteInput, ctx: GraphQLContext) => {
    if (!ctx.user?.businessId) throw new Error("Unauthorized");

    // FIX: Explicitly cast inputs or ensure they exist. 
    // Assuming generated types are correct, we treat unitPrice as Decimal or number.
    const subtotal = input.items.reduce(
      (sum, item) => sum + (item.quantity ?? 1) * Number(item.unitPrice),
      0
    );
    
    // FIX: GST -> Tax renaming
    const taxRate = input.gstRate ?? 0.1;
    const taxAmount = subtotal * taxRate;
    const totalAmount = subtotal + taxAmount;

    return ctx.prisma.quote.create({
      data: {
        businessId: ctx.user.businessId, // FIX: Connect to business
        projectId: input.projectId,
        quoteNumber: input.quoteNumber,
        expiryDate: input.expiryDate,
        status: input.status ?? "DRAFT",
        items: {
          create: input.items.map((item) => ({
            description: item.description,
            quantity: item.quantity ?? 1,
            unitPrice: item.unitPrice,
            total: (item.quantity ?? 1) * Number(item.unitPrice),
          })),
        },
        subtotal,
        taxRate,    // FIX: Renamed from gstRate
        taxAmount,  // FIX: Renamed from gstAmount
        totalAmount,
      },
      include: { items: true, project: true },
    });
  },

  update: async (id: string, input: UpdateQuoteInput, ctx: GraphQLContext) => {
    return ctx.prisma.$transaction(async (prisma) => {
      const { items, ...quoteDataWithNulls } = input;
      
      const quoteData: Prisma.QuoteUpdateInput = {
        quoteNumber: quoteDataWithNulls.quoteNumber ?? undefined,
        expiryDate: quoteDataWithNulls.expiryDate ?? undefined,
        status: quoteDataWithNulls.status ?? undefined,
        taxRate: quoteDataWithNulls.gstRate ?? undefined, // FIX: Map gstRate to taxRate
      };

      await prisma.quote.update({ where: { id }, data: quoteData });

      if (items) {
        await prisma.quoteItem.deleteMany({ where: { quoteId: id } });
        await prisma.quoteItem.createMany({
          data: items.map((item) => ({
            quoteId: id,
            description: item.description,
            quantity: item.quantity ?? 1,
            unitPrice: item.unitPrice,
            total: (item.quantity ?? 1) * Number(item.unitPrice),
          })),
        });
      }

      const currentItems = await prisma.quoteItem.findMany({ where: { quoteId: id } });
      
      // FIX: Use .toNumber() to sum Decimals
      const subtotal = currentItems.reduce((sum, i) => sum + i.total.toNumber(), 0);

      const currentQuoteState = await prisma.quote.findUnique({ where: { id } });
      
      // FIX: Use .toNumber() and correct field name
      const taxRate = currentQuoteState!.taxRate.toNumber();
      const taxAmount = subtotal * taxRate;
      const totalAmount = subtotal + taxAmount;

      await prisma.quote.update({ 
        where: { id }, 
        data: { subtotal, taxAmount, totalAmount } 
      });

      if (input.status === "ACCEPTED") {
        const finalQuote = await prisma.quote.findUnique({ where: { id } });
        await prisma.project.update({
          where: { id: finalQuote!.projectId },
          data: { budgetedAmount: finalQuote!.totalAmount },
        });
      }

      return prisma.quote.findUnique({
        where: { id },
        include: { items: true, project: true },
      });
    });
  },

  delete: (id: string, ctx: GraphQLContext) => {
    return ctx.prisma.quote.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  },
};