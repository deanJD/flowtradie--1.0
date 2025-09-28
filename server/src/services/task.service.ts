import { Task } from "@prisma/client";
import { GraphQLContext } from "../context.js";

export const taskService = {
  getAllByJob: (jobId: string, ctx: GraphQLContext): Promise<Task[]> => {
    return ctx.prisma.task.findMany({
      where: { jobId },
      orderBy: { createdAt: "desc" },
    });
  },

  getById: (id: string, ctx: GraphQLContext): Promise<Task | null> => {
    return ctx.prisma.task.findUnique({
      where: { id },
      include: { assignedTo: true, job: true },
    });
  },

  create: async (
    input: {
      jobId: string;
      title: string;
      description?: string;
      dueDate?: Date;
      assignedToId?: string;
    },
    ctx: GraphQLContext
  ): Promise<Task> => {
    try {
      return await ctx.prisma.task.create({
        data: {
          ...input,
          description: input.description ?? null,
          dueDate: input.dueDate ?? undefined,
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

  update: async (
    id: string,
    input: Partial<Task>,
    ctx: GraphQLContext
  ): Promise<Task> => {
    try {
      return await ctx.prisma.task.update({
        where: { id },
        data: {
          ...input,
          description: input.description ?? null,
          dueDate: input.dueDate ?? undefined,
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

  delete: (id: string, ctx: GraphQLContext): Promise<Task> => {
    return ctx.prisma.task.delete({ where: { id } });
  },
};
