// server/src/services/payment.service.ts
import { GraphQLContext } from "../context.js";
import { Prisma } from "@prisma/client";
import { RecordPaymentInput, UpdatePaymentInput } from "@/__generated__/graphql.js";

// Helper function to keep logic DRY (Don't Repeat Yourself)
const _updateInvoiceStatus = async (invoiceId: string, prisma: Prisma.TransactionClient) => {
  const invoice = await prisma.invoice.findUnique({
    where: { id: invoiceId },
    // CHANGED: When including payments, only get the non-deleted ones
    include: {
      payments: {
        where: { deletedAt: null },
      },
    },
  });

  if (!invoice) return;

  // This calculation is now automatically correct because it's only seeing non-deleted payments
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
      where: {
        invoiceId,
        deletedAt: null, // <-- CHANGED
      },
      orderBy: { date: "desc" },
    });
  },

  create: async (input: RecordPaymentInput, ctx: GraphQLContext) => {
    return ctx.prisma.$transaction(async (prisma) => {
      const payment = await prisma.payment.create({
        data: { ...input, date: input.date ?? new Date() },
      });
      // This helper will now work correctly with soft-deleted payments
      await _updateInvoiceStatus(input.invoiceId, prisma);
      return payment;
    });
  },

  update: async (id: string, input: UpdatePaymentInput, ctx: GraphQLContext) => {
    const dataForPrisma: Prisma.PaymentUpdateInput = {
      amount: input.amount ?? undefined,
      date: input.date ?? undefined,
      method: input.method ?? undefined,
      notes: input.notes ?? undefined,
    };

    return ctx.prisma.$transaction(async (prisma) => {
      const updatedPayment = await prisma.payment.update({
        where: { id },
        data: dataForPrisma,
      });
      // This helper will now work correctly with soft-deleted payments
      await _updateInvoiceStatus(updatedPayment.invoiceId, prisma);
      return updatedPayment;
    });
  },

  delete: async (id: string, ctx: GraphQLContext) => {
    return ctx.prisma.$transaction(async (prisma) => {
      // Step 1: Find the payment to get its invoiceId before "deleting"
      const paymentToSoftDelete = await prisma.payment.findUnique({ where: { id } });
      if (!paymentToSoftDelete) throw new Error("Payment not found");
      const { invoiceId } = paymentToSoftDelete;

      // Step 2: CHANGED - This is now a soft delete
      const softDeletedPayment = await prisma.payment.update({
        where: { id },
        data: {
          deletedAt: new Date(),
        },
      });

      // Step 3: Recalculate the invoice status, which will now exclude the deleted payment
      await _updateInvoiceStatus(invoiceId, prisma);

      return softDeletedPayment;
    });

    
  },
};
