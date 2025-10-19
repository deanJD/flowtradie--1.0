import { billableItemService } from "../../services/billable_item.service.js";
export const billableItemResolvers = {
    Query: {
        billableItems: (_p, _a, ctx) => {
            return billableItemService.getAll(ctx);
        },
    },
    Mutation: {
        createBillableItem: (_p, { input }, ctx) => {
            return billableItemService.create(input, ctx);
        },
        updateBillableItem: (_p, { id, input }, ctx) => {
            return billableItemService.update(id, input, ctx);
        },
        deleteBillableItem: (_p, { id }, ctx) => {
            return billableItemService.delete(id, ctx);
        },
    },
};
//# sourceMappingURL=billable_item.resolvers.js.map