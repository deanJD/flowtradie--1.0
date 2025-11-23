// server/src/graphql/resolvers/task.ts
import { taskService } from "../../services/task.service.js";
export const taskResolvers = {
    Query: {
        // ⛳ NO ARGUMENTS ANYMORE
        tasks: async (_p, _args, ctx) => {
            return (await taskService.getAll(ctx)); // get all tasks for business
        },
        task: async (_p, args, ctx) => {
            return (await taskService.getById(args.id, ctx));
        },
    },
    Mutation: {
        createTask: async (_p, { input }, ctx) => {
            return (await taskService.create(input, ctx));
        },
        updateTask: async (_p, { id, input }, ctx) => {
            return (await taskService.update(id, input, ctx));
        },
        deleteTask: async (_p, { id }, ctx) => {
            return (await taskService.delete(id, ctx));
        },
    },
};
//# sourceMappingURL=task.js.map