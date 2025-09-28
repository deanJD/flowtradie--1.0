import { Customer } from "@prisma/client";
import { GraphQLContext } from "../../context.js";
import { handlePrismaError } from "../../utils/handlePrismaError.js";

// ✅ Actual resolvers
export const customerResolvers = {
  Query: {
    customers: (_p: unknown, _a: unknown, ctx: GraphQLContext) =>
      customerService.getAll(ctx),
    customer: (_p: unknown, args: { id: string }, ctx: GraphQLContext) =>
      customerService.getById(args.id, ctx),
  },

  Mutation: {
    createCustomer: (_p: unknown, args: { input: Omit<Customer, "id" | "createdAt" | "updatedAt"> }, ctx: GraphQLContext) =>
      customerService.create(args.input, ctx),

    updateCustomer: (_p: unknown, args: { id: string; input: Partial<Customer> }, ctx: GraphQLContext) =>
      customerService.update(args.id, args.input, ctx),

    deleteCustomer: (_p: unknown, args: { id: string }, ctx: GraphQLContext) =>
      customerService.delete(args.id, ctx),
  },
};

// ✅ Keep your service
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
      handlePrismaError(error, "Customer creation");
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
