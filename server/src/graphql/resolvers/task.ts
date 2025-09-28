// src/graphql/resolvers/task.ts
import type { Task, Job, User } from "@prisma/client";
import { GraphQLContext } from "../../context.js";

export const taskResolvers = {
  Query: {
    tasks: (_p: unknown, args: { jobId: string }, ctx: GraphQLContext): Promise<Task[]> => {
      return ctx.prisma.task.findMany({
        where: { jobId: args.jobId },
        orderBy: { createdAt: "desc" },
        include: { assignedTo: true, job: true },
      });
    },

    task: (_p: unknown, args: { id: string }, ctx: GraphQLContext): Promise<Task | null> => {
      return ctx.prisma.task.findUnique({
        where: { id: args.id },
        include: { assignedTo: true, job: true },
      });
    },
  },

  Mutation: {
    createTask: async (
      _p: unknown,
      args: {
        input: {
          jobId: string;
          title: string;
          description?: string;
          dueDate?: Date;
          assignedToId?: string;
        };
      },
      ctx: GraphQLContext
    ): Promise<Task> => {
      try {
        return await ctx.prisma.task.create({
          data: {
            ...args.input,
            description: args.input.description ?? null,
            dueDate: args.input.dueDate ?? undefined,
          },
          include: { assignedTo: true, job: true },
        });
      } catch (error: any) {
        if (error.code === "P2003") {
          throw new Error("Invalid jobId or assignedToId. Please check that the Job and User exist.");
        }
        throw error;
      }
    },

    updateTask: (
      _p: unknown,
      args: { id: string; input: Partial<Task> },
      ctx: GraphQLContext
    ): Promise<Task> => {
      return ctx.prisma.task.update({
        where: { id: args.id },
        data: {
          ...args.input,
          description: args.input.description ?? null,
          dueDate: args.input.dueDate ?? undefined,
        },
        include: { assignedTo: true, job: true },
      });
    },

    deleteTask: (_p: unknown, args: { id: string }, ctx: GraphQLContext): Promise<Task> => {
      return ctx.prisma.task.delete({ where: { id: args.id } });
    },
  },

  // 👇 Relational Resolvers
  Job: {
    tasks: (parent: Job, _a: unknown, ctx: GraphQLContext): Promise<Task[]> => {
      return ctx.prisma.task.findMany({
        where: { jobId: parent.id },
        orderBy: { createdAt: "desc" },
      });
    },
  },

  Task: {
    assignedTo: (parent: Task, _a: unknown, ctx: GraphQLContext): Promise<User | null> => {
      return ctx.prisma.user.findUnique({
        where: { id: parent.assignedToId ?? undefined },
      });
    },
    job: (parent: Task, _a: unknown, ctx: GraphQLContext): Promise<Job | null> => {
      return ctx.prisma.job.findUnique({
        where: { id: parent.jobId },
      });
    },
  },
};
