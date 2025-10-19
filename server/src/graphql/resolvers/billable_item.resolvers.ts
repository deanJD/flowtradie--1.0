// server/src/graphql/resolvers/billable_item.ts
import { GraphQLContext } from "../../context.js";
import { billableItemService } from "../../services/billable_item.service.js";
import { CreateBillableItemInput, UpdateBillableItemInput } from "@/__generated__/graphql.js";

export const billableItemResolvers = {
  Query: {
    billableItems: (
      _p: unknown,
      _a: unknown,
      ctx: GraphQLContext
    ) => {
      return billableItemService.getAll(ctx);
    },
  },
  Mutation: {
    createBillableItem: (
      _p: unknown,
      { input }: { input: CreateBillableItemInput },
      ctx: GraphQLContext
    ) => {
      return billableItemService.create(input, ctx);
    },
    updateBillableItem: (
      _p: unknown,
      { id, input }: { id: string; input: UpdateBillableItemInput },
      ctx: GraphQLContext
    ) => {
      return billableItemService.update(id, input, ctx);
    },
    deleteBillableItem: (
      _p: unknown,
      { id }: { id: string },
      ctx: GraphQLContext
    ) => {
      return billableItemService.delete(id, ctx);
    },
  },
};