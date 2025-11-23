// src/services/timelog.service.ts
import { GraphQLContext } from "../context.js";
import {
  CreateTimeLogInput,
  UpdateTimeLogInput,
} from "@/__generated__/graphql.js";

export async function getAll(ctx: GraphQLContext) {
  const result = await ctx.prisma.timeLog.findMany({
    where: { businessId: ctx.businessId },
    include: { project: true, user: true },
  });

  return result.map((log) => ({
    ...log,
    hoursWorked: log.hoursWorked.toNumber(), // 🔥 FIX
  }));
}

export async function getById(id: string, ctx: GraphQLContext) {
  const log = await ctx.prisma.timeLog.findUnique({
    where: { id },
    include: { project: true, user: true },
  });

  return log ? { ...log, hoursWorked: log.hoursWorked.toNumber() } : null;
}

export async function create(input: CreateTimeLogInput, ctx: GraphQLContext) {
  const log = await ctx.prisma.timeLog.create({
    data: { ...input, businessId: ctx.businessId },
    include: { project: true, user: true },
  });

  return { ...log, hoursWorked: log.hoursWorked.toNumber() };
}

export async function update(id: string, input: UpdateTimeLogInput, ctx: GraphQLContext) {
  const { hoursWorked, ...rest } = input;
  const updateData = {
    ...rest,
    ...(hoursWorked !== null && hoursWorked !== undefined ? { hoursWorked } : {}),
  };

  const log = await ctx.prisma.timeLog.update({
    where: { id },
    data: updateData,
    include: { project: true, user: true },
  });

  return { ...log, hoursWorked: log.hoursWorked.toNumber() };
}

export async function remove(id: string, ctx: GraphQLContext) {
  const log = await ctx.prisma.timeLog.findUnique({
    where: { id },
    include: { project: true, user: true },
  });

  if (!log) return null;

  await ctx.prisma.timeLog.delete({ where: { id } });
  return { ...log, hoursWorked: log.hoursWorked.toNumber() }; // 🔥 Return full previous version
}
