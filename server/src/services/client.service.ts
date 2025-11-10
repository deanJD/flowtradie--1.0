// server/src/services/client.service.ts
import { GraphQLContext } from "../context.js";
import { Prisma } from "@prisma/client";
import {
  CreateClientInput,
  UpdateClientInput,
} from "@/__generated__/graphql.js";

export const clientService = {
  // ✅ GET ALL (soft-delete aware)
  getAll: (ctx: GraphQLContext) => {
    return ctx.prisma.client.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: "desc" },
    });
  },

  // ✅ GET BY ID (soft-delete aware)
  getById: (id: string, ctx: GraphQLContext) => {
    return ctx.prisma.client.findFirst({
      where: { id, deletedAt: null },
    });
  },

  // ✅ CREATE (includes new address fields)
  create: (input: CreateClientInput, ctx: GraphQLContext) => {
    return ctx.prisma.client.create({
      data: {
        name: input.name,
        email: input.email,
        phone: input.phone ?? null,

        // ✅ NEW STRUCTURED ADDRESS FIELDS
        addressLine1: input.addressLine1 ?? null,
        addressLine2: input.addressLine2 ?? null,
        city: input.city ?? null,
        state: input.state ?? null,
        postcode: input.postcode ?? null,
        country: input.country ?? null,
      },
    });
  },

  // ✅ UPDATE (also structured + partial-safe)
  update: (id: string, input: UpdateClientInput, ctx: GraphQLContext) => {
    const data: Prisma.ClientUpdateInput = {
      name: input.name ?? undefined,
      email: input.email ?? undefined,
      phone: input.phone ?? undefined,

      // ✅ STRUCTURED ADDRESS FIELDS
      addressLine1: input.addressLine1 ?? undefined,
      addressLine2: input.addressLine2 ?? undefined,
      city: input.city ?? undefined,
      state: input.state ?? undefined,
      postcode: input.postcode ?? undefined,
      country: input.country ?? undefined,
    };

    return ctx.prisma.client.update({
      where: { id },
      data,
    });
  },

  // ✅ SOFT DELETE
  delete: (id: string, ctx: GraphQLContext) => {
    return ctx.prisma.client.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  },
};
