// server/src/graphql/resolvers/task.ts
import { taskService } from "../../services/task.service.js";
export const taskResolvers = {
    Query: {
        // ⛳ NO ARGUMENTS ANYMORE
        tasks: async (_p, _args, ctx) => {
            return taskService.getAll(ctx); // returns tasks for the logged-in business
        },
        task: async (_p, args, ctx) => {
            return taskService.getById(args.id, ctx);
        },
    },
    Mutation: {
        createTask: async (_p, { input }, ctx) => {
            return taskService.create(input, ctx);
        },
        updateTask: async (_p, { id, input }, ctx) => {
            return taskService.update(id, input, ctx);
        },
        deleteTask: async (_p, { id }, ctx) => {
            return taskService.delete(id, ctx);
        },
    },
};
//# sourceMappingURL=task.js.map