// server/src/services/billable_item.service.ts
import { GraphQLContext } from "../context.js";
import { Prisma } from "@prisma/client";
import { CreateBillableItemInput, UpdateBillableItemInput } from "@/__generated__/graphql.js";

export const billableItemService = {
  // Get all non-deleted items
  getAll: (ctx: GraphQLContext) => {
    return ctx.prisma.billableItem.findMany({
      where: { deletedAt: null },
      orderBy: { name: "asc" },
    });
  },

  // Create a new item
  create: (input: CreateBillableItemInput, ctx: GraphQLContext) => {
    return ctx.prisma.billableItem.create({
      data: input,
    });
  },

  // Update an existing item
  update: (id: string, input: UpdateBillableItemInput, ctx: GraphQLContext) => {
    const data: Prisma.BillableItemUpdateInput = {
      name: input.name ?? undefined,
      description: input.description ?? undefined,
      unitPrice: input.unitPrice ?? undefined,
    };
    return ctx.prisma.billableItem.update({
      where: { id },
      data,
    });
  },

  // Soft delete an item
  delete: (id: string, ctx: GraphQLContext) => {
    return ctx.prisma.billableItem.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  },
};