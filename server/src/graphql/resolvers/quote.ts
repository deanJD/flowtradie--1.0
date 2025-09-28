// This file is now fully typed with TypeScript.

import type { Quote, QuoteItem, Job, QuoteStatus } from '@prisma/client';
import { GraphQLContext } from '../../prisma/client.js';

// --- Input Types ---
// Define interfaces for the mutation arguments to ensure type safety.
interface CreateItemInput {
  description: string;
  quantity: number;
  unitPrice: number;
}

interface CreateQuoteInput {
  jobId: string;
  quoteNumber: string;
  status?: QuoteStatus;
  expiryDate?: Date;
  items: CreateItemInput[];
}

export const quoteResolvers = {
  Query: {
    quote: (
      _parent: unknown,
      { id }: { id: string },
      { prisma }: GraphQLContext
    ): Promise<Quote | null> => {
      return prisma.quote.findUnique({
        where: { id },
      });
    },
  },
  Mutation: {
    createQuote: (
      _parent: unknown,
      { input }: { input: CreateQuoteInput },
      { prisma }: GraphQLContext
    ): Promise<Quote> => {
      // Calculate the total amount from the line items on the server-side
      // to ensure data integrity.
      const totalAmount = input.items.reduce((sum, item) => {
        const itemTotal = item.quantity * item.unitPrice;
        return sum + itemTotal;
      }, 0);

      return prisma.quote.create({
        data: {
          jobId: input.jobId,
          quoteNumber: input.quoteNumber,
          status: input.status,
          expiryDate: input.expiryDate,
          totalAmount: totalAmount,
          subtotal: totalAmount, // Add subtotal property, adjust calculation if needed
          // Create the related quote items in the same database transaction.
          items: {
            create: input.items.map(item => ({
              description: item.description,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              total: item.quantity * item.unitPrice,
            })),
          },
        },
      });
    },
  },
  // --- Relational Resolvers ---
  Quote: {
    // FIX: Made this function async to correctly handle returning a Promise.
    job: async (parent: Quote, _args: unknown, { prisma }: GraphQLContext): Promise<Job | null> => {
      // We check for parent.jobId to prevent a crash if it's somehow missing.
      if (!parent.jobId) return null;
      return prisma.job.findUnique({ where: { id: parent.jobId } });
    },
    items: (parent: Quote, _args: unknown, { prisma }: GraphQLContext): Promise<QuoteItem[]> => {
      return prisma.quoteItem.findMany({ where: { quoteId: parent.id } });
    },
  },
};

