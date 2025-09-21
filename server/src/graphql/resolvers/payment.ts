// This file contains the business logic for handling Payment data.

import type { Payment, Invoice, InvoiceStatus } from '@prisma/client';
import { GraphQLContext } from '../../prisma/client.js';

// --- Input Types ---
interface RecordPaymentInput {
  invoiceId: string;
  amount: number;
  date: Date;
  method: string;
  notes?: string;
}

export const paymentResolvers = {
  Mutation: {
    // REFACTORED: This mutation is now "smarter".
    recordPayment: async (
      _parent: unknown,
      { input }: { input: RecordPaymentInput },
      { prisma }: GraphQLContext
    ): Promise<Payment> => {
      // Use a Prisma transaction to ensure both operations succeed or fail together.
      return prisma.$transaction(async (tx) => {
        // 1. Record the new payment.
        const newPayment = await tx.payment.create({
          data: input,
        });

        // 2. Get all payments for this invoice, including the new one.
        const payments = await tx.payment.findMany({
          where: { invoiceId: input.invoiceId },
        });

        // 3. Get the invoice details to check its total amount.
        const invoice = await tx.invoice.findUnique({
          where: { id: input.invoiceId },
        });

        if (!invoice) {
          throw new Error('Invoice not found');
        }

        // 4. Calculate the total amount paid so far.
        const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);

        // 5. Determine the new status.
        let newStatus: InvoiceStatus = 'PARTIALLY_PAID';
        if (totalPaid >= invoice.totalAmount) {
          newStatus = 'PAID';
        }

        // 6. Update the invoice's status.
        await tx.invoice.update({
          where: { id: input.invoiceId },
          data: { status: newStatus },
        });

        // 7. Return the newly created payment record.
        return newPayment;
      });
    },
  },

  // --- Relational Resolver ---
  Payment: {
    invoice: (
      parent: Payment,
      _args: unknown,
      { prisma }: GraphQLContext
    ): Promise<Invoice | null> => {
      return prisma.invoice.findUnique({ where: { id: parent.invoiceId } });
    },
  },
};

