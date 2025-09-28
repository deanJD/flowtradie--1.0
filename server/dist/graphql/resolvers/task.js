import { taskService } from "../../services/task.service.js";
export const taskResolvers = {
    Query: {
        task: (_p, args, ctx) => taskService.getById(args.id, ctx),
    },
    Mutation: {
        createTask: (_p, args, ctx) => {
            const input = {
                ...args.input,
                dueDate: args.input.dueDate ? new Date(args.input.dueDate) : undefined,
            };
            return taskService.create(input, ctx);
        },
        updateTask: (_p, args, ctx) => {
            const input = {
                ...args.input,
                dueDate: args.input.dueDate ? new Date(args.input.dueDate) : undefined,
            };
            return taskService.update(args.id, input, ctx);
        },
        deleteTask: (_p, args, ctx) => taskService.delete(args.id, ctx),
    },
    Task: {
        job: (parent, _a, ctx) => ctx.prisma.job.findUnique({ where: { id: parent.jobId } }),
        assignedTo: (parent, _a, ctx) => parent.assignedToId
            ? ctx.prisma.user.findUnique({ where: { id: parent.assignedToId } })
            : null,
    },
};
//# sourceMappingURL=task.js.map