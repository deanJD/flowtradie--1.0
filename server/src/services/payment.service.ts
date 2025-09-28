import { Payment } from "@prisma/client";
import { GraphQLContext } from "../context.js";

interface CreatePaymentInput {
  invoiceId: string;
  amount: number;
  method: string;
  notes?: string;
  date?: Date;
}

interface UpdatePaymentInput {
  amount?: number;
  method?: string;
  notes?: string;
  date?: Date;
}

export const paymentService = {
  getByInvoice: (invoiceId: string, ctx: GraphQLContext): Promise<Payment[]> => {
    return ctx.prisma.payment.findMany({
      where: { invoiceId },
      orderBy: { date: "desc" },
    });
  },

  create: async (input: CreatePaymentInput, ctx: GraphQLContext): Promise<Payment> => {
    const payment = await ctx.prisma.payment.create({
      data: {
        ...input,
        date: input.date ?? new Date(),
      },
    });

    // Update invoice status if fully or partially paid
    const invoice = await ctx.prisma.invoice.findUnique({
      where: { id: input.invoiceId },
      include: { payments: true },
    });
    if (invoice) {
      const paidSoFar = invoice.payments.reduce((sum, p) => sum + p.amount, 0) + input.amount;

      let newStatus = invoice.status;
      if (paidSoFar >= invoice.totalAmount) {
        newStatus = "PAID";
      } else if (paidSoFar > 0) {
        newStatus = "PARTIALLY_PAID";
      }

      await ctx.prisma.invoice.update({
        where: { id: invoice.id },
        data: { status: newStatus },
      });
    }

    return payment;
  },

  update: (id: string, input: UpdatePaymentInput, ctx: GraphQLContext): Promise<Payment> => {
    return ctx.prisma.payment.update({
      where: { id },
      data: input,
    });
  },

  delete: (id: string, ctx: GraphQLContext): Promise<Payment> => {
    return ctx.prisma.payment.delete({ where: { id } });
  },
};
