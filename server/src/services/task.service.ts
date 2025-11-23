// server/src/services/task.service.ts

import { GraphQLContext } from "../context.js";
import {
  CreateTaskInput,
  UpdateTaskInput,
} from "@/__generated__/graphql.js";

export const taskService = {
  /* ------------------------------------------
     Get all tasks for a specific project
  ------------------------------------------- */
 // NEW FUNCTION – get ALL tasks for business
getAll: async (ctx: GraphQLContext) => {
  if (!ctx.user?.businessId) throw new Error("Unauthorized");

  return ctx.prisma.task.findMany({
    where: { businessId: ctx.user.businessId, deletedAt: null },
    orderBy: { createdAt: "desc" },
  });
},


  /* ------------------------------------------
     Get a single task
  ------------------------------------------- */
  getById: async (id: string, ctx: GraphQLContext) => {
    if (!ctx.user?.businessId) throw new Error("Unauthorized");
    const businessId = ctx.user.businessId;

    return ctx.prisma.task.findFirst({
      where: { id, businessId, deletedAt: null },
      include: { project: true, assignedTo: true },
    });
  },

  /* ------------------------------------------
     Create task
  ------------------------------------------- */
  create: async (input: CreateTaskInput, ctx: GraphQLContext) => {
    if (!ctx.user?.businessId) throw new Error("Unauthorized");
    const businessId = ctx.user.businessId;

    return ctx.prisma.task.create({
      data: {
        ...input,      // title, description, assignedToId, etc.
        businessId,    // REQUIRED by Prisma
      },
    });
  },

  /* ------------------------------------------
     Update task
  ------------------------------------------- */
  // server/src/services/task.service.ts (UPDATE METHOD ONLY)

update: async (id: string, input: UpdateTaskInput, ctx: GraphQLContext) => {
  if (!ctx.user?.businessId) throw new Error("Unauthorized");
  const businessId = ctx.user.businessId;

  // ❗ FIX: Strip out null values (Prisma hates them during update)
  const filteredInput = Object.fromEntries(
    Object.entries(input).filter(([_, v]) => v !== null)
  );

  return ctx.prisma.task.update({
    where: { id, businessId },
    data: filteredInput,  // 🧼 CLEAN INPUT
    include: { project: true, assignedTo: true },
  });
},

  /* ------------------------------------------
     Soft delete
  ------------------------------------------- */
  delete: async (id: string, ctx: GraphQLContext) => {
    if (!ctx.user?.businessId) throw new Error("Unauthorized");
    const businessId = ctx.user.businessId;

    return ctx.prisma.task.update({
      where: { id, businessId },
      data: { deletedAt: new Date() },
      select: { id: true },
    });
  },
};
