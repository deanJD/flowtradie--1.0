// server/src/services/task.service.ts
import { GraphQLContext } from "../context.js";
import { Prisma } from "@prisma/client";
import { CreateTaskInput, UpdateTaskInput } from "@/__generated__/graphql.js";

// Define the 'include' object once to keep our code DRY
const taskInclude = {
  assignedTo: true,
  job: true,
};

export const taskService = {
  getAllByJob: (jobId: string, ctx: GraphQLContext) => {
    return ctx.prisma.task.findMany({
      where: { jobId },
      orderBy: { createdAt: "desc" },
      include: taskInclude,
    });
  },

  getById: (id: string, ctx: GraphQLContext) => {
    return ctx.prisma.task.findUnique({
      where: { id },
      include: taskInclude,
    });
  },

  create: async (input: CreateTaskInput, ctx: GraphQLContext) => {
    try {
      return await ctx.prisma.task.create({
        data: input,
        include: taskInclude,
      });
    } catch (error: any) {
      // Keep your excellent error handling for invalid foreign keys
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2003") {
        throw new Error("Invalid jobId or assignedToId. The Job or User does not exist.");
      }
      throw error;
    }
  },

  update: (id: string, input: UpdateTaskInput, ctx: GraphQLContext) => {
    // Manually build the data object to handle nulls and relations
    const data: Prisma.TaskUpdateInput = {
      title: input.title ?? undefined,
      description: input.description ?? undefined,
      isCompleted: input.isCompleted ?? undefined,
      dueDate: input.dueDate ?? undefined,
      assignedTo:
        input.assignedToId === null
          ? { disconnect: true }
          : input.assignedToId
          ? { connect: { id: input.assignedToId } }
          : undefined,
    };
    return ctx.prisma.task.update({
      where: { id },
      data: data,
      include: taskInclude,
    });
  },

  delete: (id: string, ctx: GraphQLContext) => {
    return ctx.prisma.task.delete({ where: { id } });
  },
};