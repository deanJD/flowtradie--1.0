// server/src/services/client.service.ts
import { GraphQLContext } from "../context.js";
import { Prisma } from "@prisma/client";
import { CreateClientInput, UpdateClientInput } from "@/__generated__/graphql.js";

export const clientService = {
  getAll: (ctx: GraphQLContext) => {
    return ctx.prisma.client.findMany({
      where: { deletedAt: null }, // <-- CHANGED: Only find non-deleted clients
      orderBy: { createdAt: "desc" },
    });
  },

  getById: (id: string, ctx: GraphQLContext) => {
    // CHANGED: Use findFirst to ensure we don't fetch a deleted client
    return ctx.prisma.client.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });
  },

  create: (input: CreateClientInput, ctx: GraphQLContext) => {
    return ctx.prisma.client.create({
      data: input,
    });
  },

  update: (id: string, input: UpdateClientInput, ctx: GraphQLContext) => {
    const data: Prisma.ClientUpdateInput = {
      name: input.name ?? undefined,
      email: input.email ?? undefined,
      phone: input.phone ?? undefined,
      address: input.address ?? undefined,
    };
    return ctx.prisma.client.update({
      where: { id },
      data,
    });
  },

  delete: (id: string, ctx: GraphQLContext) => {
    // CHANGED: This is now a soft delete
    return ctx.prisma.client.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  },
};