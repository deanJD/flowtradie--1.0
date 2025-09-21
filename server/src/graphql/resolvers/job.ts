// This file is now fully typed with TypeScript.

import type { Job, Customer, Invoice, Quote, JobStatus } from '@prisma/client';
import { GraphQLContext } from '../../prisma/client.js'; // Reuse the context type

// --- Input Types ---
// Define interfaces for the mutation arguments to ensure type safety.
interface CreateJobInput {
  title: string;
  customerId: string;
  description?: string;
  location?: string;
  status?: JobStatus; // Use the official Prisma-generated type
  startDate?: Date;
  endDate?: Date;
}

interface UpdateJobInput {
  title?: string;
  description?: string;
  location?: string;
  status?: JobStatus;
  startDate?: Date;
  endDate?: Date;
}

export const jobResolvers = {
  Query: {
    jobs: (
      _parent: unknown,
      { customerId }: { customerId?: string },
      { prisma }: GraphQLContext
    ): Promise<Job[]> => {
      return prisma.job.findMany({
        where: { customerId },
        orderBy: { createdAt: 'desc' },
      });
    },
    job: (
      _parent: unknown,
      { id }: { id: string },
      { prisma }: GraphQLContext
    ): Promise<Job | null> => {
      return prisma.job.findUnique({ where: { id } });
    },
  },
  Mutation: {
    createJob: (
      _parent: unknown,
      { input }: { input: CreateJobInput },
      { prisma }: GraphQLContext
    ): Promise<Job> => {
      return prisma.job.create({
        data: input,
      });
    },
    updateJob: (
      _parent: unknown,
      { id, input }: { id: string; input: UpdateJobInput },
      { prisma }: GraphQLContext
    ): Promise<Job> => {
      return prisma.job.update({
        where: { id },
        data: input,
      });
    },
    deleteJob: (
      _parent: unknown,
      { id }: { id: string },
      { prisma }: GraphQLContext
    ): Promise<Job> => {
      return prisma.job.delete({ where: { id } });
    },
  },

  // --- Relational Resolvers ---
  Job: {
    customer: (parent: Job, _args: unknown, { prisma }: GraphQLContext): Promise<Customer | null> => {
      return prisma.customer.findUnique({ where: { id: parent.customerId } });
    },
    invoices: (parent: Job, _args: unknown, { prisma }: GraphQLContext): Promise<Invoice[]> => {
      return prisma.invoice.findMany({ where: { jobId: parent.id } });
    },
    quotes: (parent: Job, _args: unknown, { prisma }: GraphQLContext): Promise<Quote[]> => {
      return prisma.quote.findMany({ where: { jobId: parent.id } });
    },
  },
};

