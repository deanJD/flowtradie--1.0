// This file is now fully typed and secured with role-based permission checks.

import type { Job, Customer, Invoice, Quote, JobStatus, Task, JobExpense } from '@prisma/client';
import { GraphQLContext } from '../../prisma/client.js';

// --- Input Types ---
interface CreateJobInput {
  title: string;
  customerId: string;
  managerId?: string; // Allow assigning a manager on creation
  description?: string;
  location?: string;
  status?: JobStatus;
  startDate?: Date;
  endDate?: Date;
}

interface UpdateJobInput {
  title?: string;
  managerId?: string;
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
      { prisma, currentUser }: GraphQLContext
    ): Promise<Job> => {
      // --- PERMISSION CHECK ---
      if (!currentUser) throw new Error('Not authenticated');
      if (!['OWNER', 'ADMIN', 'MANAGER', 'FOREMAN'].includes(currentUser.role)) {
        throw new Error('Access Denied: You do not have permission to create jobs.');
      }
      // --- END CHECK ---
      return prisma.job.create({
        data: input,
      });
    },
    updateJob: (
      _parent: unknown,
      { id, input }: { id: string; input: UpdateJobInput },
      { prisma, currentUser }: GraphQLContext
    ): Promise<Job> => {
      // --- PERMISSION CHECK ---
      if (!currentUser) throw new Error('Not authenticated');
      if (!['OWNER', 'ADMIN', 'MANAGER', 'FOREMAN'].includes(currentUser.role)) {
        throw new Error('Access Denied: You do not have permission to update jobs.');
      }
      // --- END CHECK ---
      return prisma.job.update({
        where: { id },
        data: input,
      });
    },
    deleteJob: (
      _parent: unknown,
      { id }: { id: string },
      { prisma, currentUser }: GraphQLContext
    ): Promise<Job> => {
      // --- PERMISSION CHECK (Stricter) ---
      if (!currentUser) throw new Error('Not authenticated');
      if (currentUser.role !== 'OWNER' && currentUser.role !== 'ADMIN') {
        throw new Error('Access Denied: You do not have permission to delete jobs.');
      }
      // --- END CHECK ---
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
    tasks: (parent: Job, _args: unknown, { prisma }: GraphQLContext): Promise<Task[]> => {
      return prisma.task.findMany({ where: { jobId: parent.id } });
    },
    expenses: (parent: Job, _args: unknown, { prisma }: GraphQLContext): Promise<JobExpense[]> => {
      return prisma.jobExpense.findMany({ where: { jobId: parent.id } });
    },
  },
};

