// server/src/services/payment.service.ts
import { GraphQLContext } from "../context.js";
import { InvoiceStatus } from "@prisma/client";
import {
  CreatePaymentInput,
  UpdatePaymentInput,
} from "@/__generated__/graphql.js";

/**
 * Helper: recalc invoice status based on payments
 * - Does NOT recalc subtotal/tax/total (invoiceService owns that)
 * - Only updates status: DRAFT / SENT / PARTIALLY_PAID / PAID
 */
async function recalcInvoiceStatus(invoiceId: string, ctx: GraphQLContext) {
  const invoice = await ctx.prisma.invoice.findUnique({
    where: { id: invoiceId },
    include: {
      payments: { where: { deletedAt: null } },
      items: true,
      project: { include: { client: true } },
    },
  });

  if (!invoice) throw new Error("Invoice not found");

  const totalAmount = Number(invoice.totalAmount);
  const totalPaid = invoice.payments.reduce(
    (sum, p) => sum + Number(p.amount),
    0
  );

  // Start from existing status so we don't blow away SENT, etc.
  let status: InvoiceStatus = invoice.status;

  if (totalPaid >= totalAmount && totalAmount > 0) {
    status = InvoiceStatus.PAID;
  } else if (totalPaid > 0 && totalPaid < totalAmount) {
    status = InvoiceStatus.PARTIALLY_PAID;
  } else {
    // no payments – keep existing (DRAFT or SENT)
    // status stays as invoice.status
  }

  const updated = await ctx.prisma.invoice.update({
    where: { id: invoiceId },
    data: { status },
    include: {
      items: true,
      payments: { where: { deletedAt: null }, orderBy: { date: "asc" } },
      project: { include: { client: true } },
    },
  });

  return updated;
}

export const paymentService = {
  /**
   * CREATE payment -> return updated Invoice
   */
  async create(input: CreatePaymentInput, ctx: GraphQLContext) {
    const { invoiceId, amount, date, method, notes } = input;

    // We need businessId + clientId from the invoice itself
    const invoice = await ctx.prisma.invoice.findUnique({
      where: { id: invoiceId },
      select: { id: true, businessId: true, clientId: true },
    });

    if (!invoice) throw new Error("Invoice not found");

    await ctx.prisma.payment.create({
      data: {
        invoiceId: invoice.id,
        businessId: invoice.businessId,
        clientId: invoice.clientId,
        amount,
        date: date ? new Date(date as unknown as string) : new Date(),
        method,
        notes: notes ?? null,
      },
    });

    return recalcInvoiceStatus(invoice.id, ctx);
  },

  /**
   * UPDATE payment -> return updated Invoice
   */
  async update(id: string, input: UpdatePaymentInput, ctx: GraphQLContext) {
    const payment = await ctx.prisma.payment.findUnique({
      where: { id },
    });

    if (!payment) throw new Error("Payment not found");

    await ctx.prisma.payment.update({
      where: { id },
      data: {
        amount: input.amount ?? undefined,
        date: input.date
          ? new Date(input.date as unknown as string)
          : undefined,
        method: input.method ?? undefined,
        notes: input.notes ?? undefined,
      },
    });

    return recalcInvoiceStatus(payment.invoiceId, ctx);
  },

  /**
   * DELETE payment (soft delete) -> return updated Invoice
   */
  async delete(id: string, ctx: GraphQLContext) {
    const payment = await ctx.prisma.payment.findUnique({
      where: { id },
    });

    if (!payment) throw new Error("Payment not found");

    // Soft delete if your Payment model has deletedAt, otherwise hard delete
    await ctx.prisma.payment.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return recalcInvoiceStatus(payment.invoiceId, ctx);
  },
};
