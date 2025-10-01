import { GraphQLContext } from "../context.js";
import { Prisma } from "@prisma/client";
import { RecordPaymentInput, UpdatePaymentInput } from "../__generated__/graphql.js" ; // <-- Using generated types


// Helper function to keep logic DRY (Don't Repeat Yourself)
const _updateInvoiceStatus = async (invoiceId: string, prisma: Prisma.TransactionClient) => {
  const invoice = await prisma.invoice.findUnique({
    where: { id: invoiceId },
    include: { payments: true },
  });

  if (!invoice) return;

  const paidSoFar = invoice.payments.reduce((sum, p) => sum + p.amount, 0);
  let newStatus = invoice.status;

  if (paidSoFar <= 0) {
    newStatus = invoice.status === "PARTIALLY_PAID" ? "SENT" : invoice.status;
  } else if (paidSoFar >= invoice.totalAmount) {
    newStatus = "PAID";
  } else {
    newStatus = "PARTIALLY_PAID";
  }

  if (newStatus !== invoice.status) {
    await prisma.invoice.update({
      where: { id: invoiceId },
      data: { status: newStatus },
    });
  }
};


export const paymentService = {
  getByInvoice: (invoiceId: string, ctx: GraphQLContext) => {
    return ctx.prisma.payment.findMany({
      where: { invoiceId },
      orderBy: { date: "desc" },
    });
  },

  create: async (input: RecordPaymentInput, ctx: GraphQLContext) => {
    return ctx.prisma.$transaction(async (prisma) => {
      const payment = await prisma.payment.create({
        data: { ...input, date: input.date ?? new Date() },
      });
      await _updateInvoiceStatus(input.invoiceId, prisma);
      return payment;
    });
  },

  update: async (id: string, input: UpdatePaymentInput, ctx: GraphQLContext) => {
    // THIS IS THE FIX: Convert nulls to undefined before sending to Prisma
    const dataForPrisma: Prisma.PaymentUpdateInput = {
      amount: input.amount ?? undefined,
      date: input.date ?? undefined,
      method: input.method ?? undefined,
      notes: input.notes ?? undefined,
    };

    return ctx.prisma.$transaction(async (prisma) => {
      const updatedPayment = await prisma.payment.update({
        where: { id },
        data: dataForPrisma, // Use the cleaned data here
      });
      await _updateInvoiceStatus(updatedPayment.invoiceId, prisma);
      return updatedPayment;
    });
  },

  delete: async (id: string, ctx: GraphQLContext) => {
    return ctx.prisma.$transaction(async (prisma) => {
      const paymentToDelete = await prisma.payment.findUnique({ where: { id } });
      if (!paymentToDelete) throw new Error("Payment not found");
      const { invoiceId } = paymentToDelete;
      await prisma.payment.delete({ where: { id } });
      await _updateInvoiceStatus(invoiceId, prisma);
      return paymentToDelete;
    });
  },
};