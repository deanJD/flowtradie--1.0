import { taskService } from "../../services/task.service.js";
export const taskResolvers = {
    Query: {
        tasks: (_p, { jobId }, ctx) => taskService.getAllByJob(jobId, ctx),
        task: (_p, { id }, ctx) => taskService.getById(id, ctx),
    },
    Mutation: {
        createTask: (_p, { input }, ctx) => taskService.create(input, ctx),
        updateTask: (_p, { id, input }, ctx) => taskService.update(id, input, ctx),
        deleteTask: (_p, { id }, ctx) => taskService.delete(id, ctx),
    },
    // Note: The extra relational resolvers for `Job.tasks`, `Task.assignedTo`,
    // and `Task.job` are no longer needed! Because our service functions now use `include`,
    // GraphQL's default resolver is smart enough to find the `job` and `assignedTo`
    // properties on the parent Task object automatically.
};
//# sourceMappingURL=task.js.map