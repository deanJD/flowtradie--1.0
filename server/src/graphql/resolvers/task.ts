
import { taskService } from "../../services/task.service.js";
import { GraphQLContext } from "../../context.js";

interface CreateTaskArgs {
  input: {
    jobId: string;
    title: string;
    description?: string;
    dueDate?: string;
    assignedToId?: string;
  };
}

interface UpdateTaskArgs {
  id: string;
  input: {
    title?: string;
    description?: string;
    dueDate?: string;
    isCompleted?: boolean;
    assignedToId?: string;
  };
}

interface DeleteTaskArgs {
  id: string;
}

export const taskResolvers = {
  Query: {
    task: (_p: unknown, args: { id: string }, ctx: GraphQLContext) =>
      taskService.getById(args.id, ctx),
  },

  Mutation: {
    createTask: (_p: unknown, args: CreateTaskArgs, ctx: GraphQLContext) => {
      const input = {
        ...args.input,
        dueDate: args.input.dueDate ? new Date(args.input.dueDate) : undefined,
      };
      return taskService.create(input, ctx);
    },

    updateTask: (_p: unknown, args: UpdateTaskArgs, ctx: GraphQLContext) => {
      const input = {
        ...args.input,
        dueDate: args.input.dueDate ? new Date(args.input.dueDate) : undefined,
      };
      return taskService.update(args.id, input, ctx);
    },

    deleteTask: (_p: unknown, args: DeleteTaskArgs, ctx: GraphQLContext) =>
      taskService.delete(args.id, ctx),
  },

  Task: {
    job: (parent: any, _a: unknown, ctx: GraphQLContext) =>
      ctx.prisma.job.findUnique({ where: { id: parent.jobId } }),

    assignedTo: (parent: any, _a: unknown, ctx: GraphQLContext) =>
      parent.assignedToId
        ? ctx.prisma.user.findUnique({ where: { id: parent.assignedToId } })
        : null,
  },
};
