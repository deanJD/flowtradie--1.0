// server/src/services/timelog.service.ts

import { GraphQLContext } from "../context.js";
import { Prisma } from "@prisma/client";
import { CreateTimeLogInput, UpdateTimeLogInput } from "@/__generated__/graphql.js";

// Define the 'include' object once to keep our code DRY
const timeLogInclude = {
  project: true,
  user: true,
};

export const timeLogService = {
  getAllByProject: (projectId: string, ctx: GraphQLContext) => {
    return ctx.prisma.timeLog.findMany({
      where: {
        projectId,
        deletedAt: null, // <-- CHANGED
      },
      orderBy: { date: "desc" },
      include: timeLogInclude,
    });
  },

  getAllByUser: (userId: string, ctx: GraphQLContext) => {
    return ctx.prisma.timeLog.findMany({
      where: {
        userId,
        deletedAt: null, // <-- CHANGED
      },
      orderBy: { date: "desc" },
      include: timeLogInclude,
    });
  },

  create: (input: CreateTimeLogInput, ctx: GraphQLContext) => {
    return ctx.prisma.timeLog.create({
      data: input,
      include: timeLogInclude,
    });
  },

  update: (id: string, input: UpdateTimeLogInput, ctx: GraphQLContext) => {
    // Manually build the data object to handle nulls
    const data: Prisma.TimeLogUpdateInput = {
      date: input.date ?? undefined,
      hoursWorked: input.hoursWorked ?? undefined,
      notes: input.notes ?? undefined,
    };

    return ctx.prisma.timeLog.update({
      where: { id },
      data: data,
      include: timeLogInclude,
    });
  },

  delete: (id: string, ctx: GraphQLContext) => {
    // CHANGED: This is now a soft delete
    return ctx.prisma.timeLog.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  },
};