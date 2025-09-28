// src/graphql/resolvers/customer.ts
import type { Customer, Job } from "@prisma/client";
import { GraphQLContext } from "../../context.js";

type CreateCustomerInput = Pick<Customer, "name" | "email" | "phone" | "address">;
type UpdateCustomerInput = Partial<CreateCustomerInput>;

export const customerResolvers = {
  Query: {
    customers: (
      _parent: unknown,
      _args: unknown,
      { prisma }: GraphQLContext
    ): Promise<Customer[]> => {
      return prisma.customer.findMany({
        orderBy: { createdAt: "desc" },
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
    createCustomer: async (
      _parent: unknown,
      { input }: { input: CreateCustomerInput },
      { prisma }: GraphQLContext
    ): Promise<Customer> => {
      try {
        return await prisma.customer.create({ data: input });
      } catch (error: any) {
        if (error.code === "P2002") {
          throw new Error("A customer with this email already exists.");
        }
        throw error;
      }
    },

    updateCustomer: async (
      _parent: unknown,
      { id, input }: { id: string; input: UpdateCustomerInput },
      { prisma }: GraphQLContext
    ): Promise<Customer> => {
      try {
        return await prisma.customer.update({ where: { id }, data: input });
      } catch (error: any) {
        if (error.code === "P2002") {
          throw new Error("Another customer already uses this email.");
        }
        throw error;
      }
    },

    deleteCustomer: (
      _parent: unknown,
      { id }: { id: string },
      { prisma }: GraphQLContext
    ): Promise<Customer> => {
      return prisma.customer.delete({ where: { id } });
    },
  },

  Customer: {
    jobs: (
      parent: Customer,
      _args: unknown,
      { prisma }: GraphQLContext
    ): Promise<Job[]> => {
      return prisma.job.findMany({
        where: { customerId: parent.id },
        orderBy: { createdAt: "desc" },
      });
    },
  },
};
