// server/src/services/job.service.ts

import { GraphQLContext } from "../context.js";
import { Prisma } from "@prisma/client";
import { CreateJobInput, UpdateJobInput } from "@/__generated__/graphql.js";

export const jobService = {
  // Find all jobs, including their customer
  getAll: (customerId: string | undefined, ctx: GraphQLContext) => {
    return ctx.prisma.job.findMany({
      where: customerId ? { customerId } : {},
      orderBy: { createdAt: "desc" },
      include: { customer: true },
    });
  },

  // Find a single job by ID, including its customer
  getById: (id: string, ctx: GraphQLContext) => {
    return ctx.prisma.job.findUnique({
      where: { id },
      include: { customer: true },
    });
  },

  // Create a new job
  create: (input: CreateJobInput, ctx: GraphQLContext) => {
    // FIX #1: Manually build the data object to handle relations
    // and to convert potential nulls to undefined.
    const data: Prisma.JobCreateInput = {
      title: input.title,
      description: input.description ?? undefined,
      location: input.location ?? undefined,
      status: input.status ?? undefined,
      startDate: input.startDate ?? undefined,
      endDate: input.endDate ?? undefined,
      // Connect relations properly
      customer: { connect: { id: input.customerId } },
      manager: input.managerId ? { connect: { id: input.managerId } } : undefined,
    };

    return ctx.prisma.job.create({
      data,
      include: { customer: true },
    });
  },

  // Update a job
  update: (id: string, input: UpdateJobInput, ctx: GraphQLContext) => {
    // FIX #2: Handle the manager relation correctly using connect/disconnect
    // and clean all other nullable fields.
    const data: Prisma.JobUpdateInput = {
      title: input.title ?? undefined,
      description: input.description ?? undefined,
      location: input.location ?? undefined,
      status: input.status ?? undefined,
      startDate: input.startDate ?? undefined,
      endDate: input.endDate ?? undefined,
      budgetedAmount: input.budgetedAmount ?? undefined,
      // Handle the manager relation update
      manager:
        input.managerId === null
          ? { disconnect: true } // If managerId is explicitly null, disconnect it
          : input.managerId
          ? { connect: { id: input.managerId } } // If an ID is provided, connect it
          : undefined, // Otherwise, do nothing
    };

    return ctx.prisma.job.update({
      where: { id },
      data,
      include: { customer: true },
    });
  },

  // Delete a job
  delete: (id: string, ctx: GraphQLContext) => {
    return ctx.prisma.job.delete({
      where: { id },
    });
  },
};