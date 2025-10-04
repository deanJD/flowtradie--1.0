// server/src/graphql/resolvers/expense.ts
import { expenseService } from "../../services/expense.service.js";
export const expenseResolvers = {
    Query: {
        expenses: (_p, { jobId }, ctx) => expenseService.getAllByJob(jobId, ctx),
    },
    Mutation: {
        createExpense: (_p, { input }, ctx) => expenseService.create(input, ctx),
        deleteExpense: (_p, { id }, ctx) => expenseService.delete(id, ctx),
    },
    // Note: The relational resolver for `JobExpense.job` is no longer needed
    // because our new service functions automatically include that data.
};
//# sourceMappingURL=expense.js.map