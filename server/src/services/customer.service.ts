// server/src/services/customer.service.ts
import { GraphQLContext } from "../context.js";
import { Prisma } from "@prisma/client";
import { CreateCustomerInput, UpdateCustomerInput } from "@/__generated__/graphql.js";

export const customerService = {
  getAll: (ctx: GraphQLContext) => {
    return ctx.prisma.customer.findMany({
      orderBy: { createdAt: "desc" },
    });
  },

  getById: (id: string, ctx: GraphQLContext) => {
    return ctx.prisma.customer.findUnique({
      where: { id },
    });
  },

  create: (input: CreateCustomerInput, ctx: GraphQLContext) => {
    return ctx.prisma.customer.create({
      data: input,
    });
  },

  update: (id: string, input: UpdateCustomerInput, ctx: GraphQLContext) => {
    const data: Prisma.CustomerUpdateInput = {
      name: input.name ?? undefined,
      email: input.email ?? undefined,
      phone: input.phone ?? undefined,
      address: input.address ?? undefined,
    };
    return ctx.prisma.customer.update({
      where: { id },
      data,
    });
  },

  delete: (id: string, ctx: GraphQLContext) => {
    return ctx.prisma.customer.delete({
      where: { id },
    });
  },
};