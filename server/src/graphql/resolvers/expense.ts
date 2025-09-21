// This file contains all the business logic for handling JobExpense data.

import type { JobExpense, Job } from '@prisma/client';
import { GraphQLContext } from '../../prisma/client.js';

// --- Input Types ---
interface CreateExpenseInput {
  jobId: string;
  description: string;
  amount: number;
  category: string;
  date?: Date;
}

export const expenseResolvers = {
  Query: {
    expenses: (
      _parent: unknown,
      { jobId }: { jobId: string },
      { prisma }: GraphQLContext
    ): Promise<JobExpense[]> => {
      return prisma.jobExpense.findMany({
        where: { jobId },
        orderBy: { date: 'desc' },
      });
    },
  },
  Mutation: {
    createExpense: (
      _parent: unknown,
      { input }: { input: CreateExpenseInput },
      { prisma }: GraphQLContext
    ): Promise<JobExpense> => {
      return prisma.jobExpense.create({ data: input });
    },
    deleteExpense: (
      _parent: unknown,
      { id }: { id: string },
      { prisma }: GraphQLContext
    ): Promise<JobExpense> => {
      return prisma.jobExpense.delete({ where: { id } });
    },
  },

  // --- Relational Resolver ---
  JobExpense: {
    job: (parent: JobExpense, _args: unknown, { prisma }: GraphQLContext): Promise<Job | null> => {
      return prisma.job.findUnique({ where: { id: parent.jobId } });
    },
  },
};
