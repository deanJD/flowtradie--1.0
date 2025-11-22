// server/src/graphql/resolvers/expense.ts
import { expenseService } from "../../services/expense.service.js";
export const expenseResolvers = {
    Query: {
        expenses: async (_p, { projectId }, ctx) => {
            return expenseService.getAllByProject(projectId, ctx);
        },
    },
    Mutation: {
        createExpense: async (_p, { input }, ctx) => {
            return expenseService.create(input, ctx);
        },
        deleteExpense: async (_p, { id }, ctx) => {
            return expenseService.delete(id, ctx);
        },
    },
};
//# sourceMappingURL=expense.js.map