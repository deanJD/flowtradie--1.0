
// This file uses advanced TypeScript features for robust type safety.

import type { Customer, Job } from '@prisma/client';
// We import our shared context type for consistency across the app.
import { GraphQLContext } from '../../prisma/client.js';

// --- Input Types ---
// Using TypeScript's utility types is a clean and scalable way to define inputs.
// 'Pick' creates a new type by picking a set of properties from an existing type.
type CreateCustomerInput = Pick<Customer, 'name' | 'email' | 'phone' | 'address'>;

// 'Partial' makes all properties of a given type optional.
// This is perfect for update mutations where any field can be changed.
type UpdateCustomerInput = Partial<CreateCustomerInput>;


export const customerResolvers = {
  Query: {
    customers: (
      _parent: unknown,
      _args: unknown,
      { prisma }: GraphQLContext
    ): Promise<Customer[]> => {
      return prisma.customer.findMany({
        orderBy: { createdAt: 'desc' },
      });
    },
    customer: (
      _parent: unknown,
      { id }: { id: string },
      { prisma }: GraphQLContext
    ): Promise<Customer | null> => {
      return prisma.customer.findUnique({ where: { id } });
    },
  },
  Mutation: {
    createCustomer: (
      _parent: unknown,
      { input }: { input: CreateCustomerInput },
      { prisma }: GraphQLContext
    ): Promise<Customer> => {
      return prisma.customer.create({ data: input });
    },
    updateCustomer: (
      _parent: unknown,
      { id, input }: { id: string; input: UpdateCustomerInput },
      { prisma }: GraphQLContext
    ): Promise<Customer> => {
      return prisma.customer.update({ where: { id }, data: input });
    },
    deleteCustomer: (
      _parent: unknown,
      { id }: { id: string },
      { prisma }: GraphQLContext
    ): Promise<Customer> => {
      return prisma.customer.delete({ where: { id } });
    },
  },
  
  // This relational resolver efficiently fetches related jobs for a customer.
  Customer: {
    jobs: (parent: Customer, _args: unknown, { prisma }: GraphQLContext): Promise<Job[]> => {
      return prisma.job.findMany({
        where: { customerId: parent.id },
        orderBy: { createdAt: 'desc' },
      });
    },
  },
};

