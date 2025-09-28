import { PrismaClient, Job } from "@prisma/client";
import { GraphQLContext } from "../context.js";

export const jobService = {
  getAll: (ctx: GraphQLContext): Promise<Job[]> => {
    return ctx.prisma.job.findMany({
      orderBy: { createdAt: "desc" },
      include: { customer: true, tasks: true, invoices: true, quotes: true },
    });
  },

  getById: (id: string, ctx: GraphQLContext): Promise<Job | null> => {
    return ctx.prisma.job.findUnique({
      where: { id },
      include: { customer: true, tasks: true, invoices: true, quotes: true },
    });
  },

  create: async (
    input: {
      title: string;
      description?: string;
      location?: string;
      status?: "PENDING" | "ACTIVE" | "COMPLETED" | "CANCELLED";
      startDate?: Date;
      endDate?: Date;
      customerId: string;
      managerId?: string;
    },
    ctx: GraphQLContext
  ): Promise<Job> => {
    return ctx.prisma.job.create({
      data: {
        ...input,
        description: input.description ?? null,
        location: input.location ?? null,
        startDate: input.startDate ?? null,
        endDate: input.endDate ?? null,
      },
    });
  },

  update: async (
    id: string,
    input: Partial<Job>,
    ctx: GraphQLContext
  ): Promise<Job> => {
    return ctx.prisma.job.update({
      where: { id },
      data: {
        ...input,
        description: input.description ?? null,
        location: input.location ?? null,
      },
    });
  },

  delete: (id: string, ctx: GraphQLContext): Promise<Job> => {
    return ctx.prisma.job.delete({ where: { id } });
  },
};
