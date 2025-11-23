// server/src/services/project.service.ts

import { GraphQLContext } from "../context.js";
import { Prisma } from "@prisma/client";
import {
  CreateProjectInput,
  UpdateProjectInput,
} from "@/__generated__/graphql.js";

export const projectService = {
  /** --------------------------------------
   *  🔍 Get ALL projects for THIS business
   *  -------------------------------------- */
  getAll: (clientId: string | undefined, ctx: GraphQLContext) => {
    if (!ctx.user?.businessId) throw new Error("Unauthorized");

    const where: Prisma.ProjectWhereInput = {
      deletedAt: null,
      businessId: ctx.user.businessId, // 🔥 MUST FILTER BY BUSINESS
    };

    if (clientId) {
      where.clientId = clientId;
    }

    return ctx.prisma.project.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { client: true },
    });
  },

  /** --------------------------------------
   *  🔎 Get ONE project by ID
   *  -------------------------------------- */
  getById: (id: string, ctx: GraphQLContext) => {
    if (!ctx.user?.businessId) throw new Error("Unauthorized");

    return ctx.prisma.project.findFirst({
      where: {
        id,
        deletedAt: null,
        businessId: ctx.user.businessId, // 🔥 Security filter
      },
      include: {
        client: true,
        tasks: true,
        quotes: true,
        invoices: true,
        timeLogs: true,
        expenses: true,
      },
    });
  },

  /** --------------------------------------
   *  🆕 Create a project
   *  -------------------------------------- */
  create: (input: CreateProjectInput, ctx: GraphQLContext) => {
    if (!ctx.user?.businessId) throw new Error("Unauthorized");

    const data: Prisma.ProjectCreateInput = {
      business: { connect: { id: ctx.user.businessId } }, // 🔥 SIMPLE & CORRECT

      title: input.title,
      description: input.description ?? undefined,
      location: input.location ?? undefined,
      status: input.status ?? undefined,
      startDate: input.startDate ?? undefined,
      endDate: input.endDate ?? undefined,

      client: { connect: { id: input.clientId } },
      manager: input.managerId
        ? { connect: { id: input.managerId } }
        : undefined,
    };

    return ctx.prisma.project.create({
      data,
      include: { client: true },
    });
  },

  /** --------------------------------------
   *  🔄 Update a project
   *  -------------------------------------- */
  update: (id: string, input: UpdateProjectInput, ctx: GraphQLContext) => {
    if (!ctx.user?.businessId) throw new Error("Unauthorized");

    const data: Prisma.ProjectUpdateInput = {
      title: input.title ?? undefined,
      description: input.description ?? undefined,
      location: input.location ?? undefined,
      status: input.status ?? undefined,
      startDate: input.startDate ?? undefined,
      endDate: input.endDate ?? undefined,
      budgetedAmount: input.budgetedAmount ?? undefined,

      manager:
        input.managerId === null
          ? { disconnect: true }
          : input.managerId
          ? { connect: { id: input.managerId } }
          : undefined,
    };

    return ctx.prisma.project.update({
      where: { id },
      data,
      include: { client: true },
    });
  },

  /** --------------------------------------
   *  🗑️ SOFT DELETE a project
   *  -------------------------------------- */
  delete: (id: string, ctx: GraphQLContext) => {
    if (!ctx.user?.businessId) throw new Error("Unauthorized");

    return ctx.prisma.project.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  },
};
