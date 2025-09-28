import { Customer } from "@prisma/client";
import { GraphQLContext } from "../context.js"; // ✅ correct path
import { handlePrismaError } from "../utils/handlePrismaError.js"; // ✅ correct path

export const customerService = {
  getAll: async (ctx: GraphQLContext): Promise<Customer[]> => {
    return ctx.prisma.customer.findMany({ orderBy: { createdAt: "desc" } });
  },

  getById: async (id: string, ctx: GraphQLContext): Promise<Customer | null> => {
    return ctx.prisma.customer.findUnique({ where: { id } });
  },

  create: async (
    input: Omit<Customer, "id" | "createdAt" | "updatedAt">,
    ctx: GraphQLContext
  ): Promise<Customer> => {
    try {
      return await ctx.prisma.customer.create({ data: input });
    } catch (error: any) {
      handlePrismaError(error, "Customer creation"); // always throws -> never returns
    }
  },

  update: async (id: string, input: Partial<Customer>, ctx: GraphQLContext): Promise<Customer> => {
    try {
      return await ctx.prisma.customer.update({ where: { id }, data: input });
    } catch (error: any) {
      handlePrismaError(error, "Customer update");
    }
  },

  delete: async (id: string, ctx: GraphQLContext): Promise<Customer> => {
    try {
      return await ctx.prisma.customer.delete({ where: { id } });
    } catch (error: any) {
      handlePrismaError(error, "Customer deletion");
    }
  },
};
