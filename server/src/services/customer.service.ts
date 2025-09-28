import { PrismaClient, Customer } from "@prisma/client";
import { GraphQLContext } from "../context.js";

export const customerService = {
  getAll: (ctx: GraphQLContext): Promise<Customer[]> => {
    return ctx.prisma.customer.findMany({ orderBy: { createdAt: "desc" } });
  },

  getById: (id: string, ctx: GraphQLContext): Promise<Customer | null> => {
    return ctx.prisma.customer.findUnique({ where: { id } });
  },

  create: async (
    input: Omit<Customer, "id" | "createdAt" | "updatedAt">,
    ctx: GraphQLContext
  ): Promise<Customer> => {
    try {
      return await ctx.prisma.customer.create({ data: input });
    } catch (error: any) {
      if (error.code === "P2002") {
        throw new Error("A customer with this email already exists.");
      }
      throw error;
    }
  },

  update: async (
    id: string,
    input: Partial<Customer>,
    ctx: GraphQLContext
  ): Promise<Customer> => {
    try {
      return await ctx.prisma.customer.update({ where: { id }, data: input });
    } catch (error: any) {
      if (error.code === "P2002") {
        throw new Error("Another customer already uses this email.");
      }
      throw error;
    }
  },

  delete: (id: string, ctx: GraphQLContext): Promise<Customer> => {
    return ctx.prisma.customer.delete({ where: { id } });
  },
};
