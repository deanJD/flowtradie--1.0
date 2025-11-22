// server/src/services/billable_item.service.ts
import { GraphQLContext } from "../../context.js";
import {
  CreateBillableItemInput,
  UpdateBillableItemInput,
} from "@/__generated__/graphql.js";

export const billableItemService = {
  /* ----------------------------
     Get All Billable Items (by business)
  ---------------------------- */
  getAll: async (businessId: string, ctx: GraphQLContext) => {
    return ctx.prisma.billableItem.findMany({
      where: { businessId, deletedAt: null },
      orderBy: { createdAt: "desc" },
    });
  },

  /* ----------------------------
     Get Single by ID
  ---------------------------- */
  getById: async (id: string, ctx: GraphQLContext) => {
    return ctx.prisma.billableItem.findFirst({
      where: { id, deletedAt: null },
    });
  },

  /* ----------------------------
     Create New Billable Item
  ---------------------------- */
  create: async (
    input: CreateBillableItemInput,
    businessId: string,
    ctx: GraphQLContext
  ) => {
    return ctx.prisma.billableItem.create({
      data: {
        ...(() => {
          const { businessId, rate, ...rest } = input;
          return {
            ...rest,
            unitPrice: rate, // Map rate to unitPrice if that's the intended mapping
          };
        })(),
        business: { connect: { id: businessId } },
      },
    });
  },

  /* ----------------------------
     Update Billable Item
  ---------------------------- */
  update: async (
    id: string,
    input: UpdateBillableItemInput,
    ctx: GraphQLContext
  ) => {
    // Remove null fields from input to satisfy Prisma types
    const filteredInput = Object.fromEntries(
      Object.entries(input).filter(([_, v]) => v !== null)
    );
    return ctx.prisma.billableItem.update({
      where: { id },
      data: filteredInput,
    });
  },

  /* ----------------------------
     Soft Delete
  ---------------------------- */
  delete: async (id: string, ctx: GraphQLContext) => {
    return ctx.prisma.billableItem.update({
      where: { id },
      data: { deletedAt: new Date() },
      select: { id: true },
    });
  },
};
