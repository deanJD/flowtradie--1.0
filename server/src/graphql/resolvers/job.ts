// src/graphql/resolvers/job.ts
import type { Job, Customer } from "@prisma/client";
import { GraphQLContext } from "../../context.js";

export const jobResolvers = {
  Query: {
    jobs: (_p: unknown, _a: unknown, ctx: GraphQLContext) => {
      return ctx.prisma.job.findMany({
        orderBy: { createdAt: "desc" },
      });
    },
    job: (_p: unknown, args: { id: string }, ctx: GraphQLContext) => {
      return ctx.prisma.job.findUnique({
        where: { id: args.id },
      });
    },
  },

  Mutation: {
    createJob: (_p: unknown, args: any, ctx: GraphQLContext) => {
      return ctx.prisma.job.create({ data: args.input });
    },
    updateJob: (_p: unknown, args: any, ctx: GraphQLContext) => {
      return ctx.prisma.job.update({
        where: { id: args.id },
        data: args.input,
      });
    },
    deleteJob: (_p: unknown, args: { id: string }, ctx: GraphQLContext) => {
      return ctx.prisma.job.delete({ where: { id: args.id } });
    },
  },

  // 👇 Relational Resolver
  Job: {
    customer: (parent: Job, _a: unknown, ctx: GraphQLContext): Promise<Customer | null> => {
      return ctx.prisma.customer.findUnique({
        where: { id: parent.customerId },
      });
    },
  },
};
