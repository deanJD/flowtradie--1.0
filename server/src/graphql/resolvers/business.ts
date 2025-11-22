// server/src/graphql/resolvers/business.ts
import { businessService } from "../../services/business.service.js";
import { GraphQLContext } from "../../context.js";

export const businessResolvers = {
  Query: {
    business: async (_: any, { id }: { id: string }, ctx: GraphQLContext) => {
      return ctx.prisma.business.findUnique({
        where: { id, deletedAt: null },
      });
    },

    businesses: async (_: any, _args: any, ctx: GraphQLContext) => {
      return ctx.prisma.business.findMany({
        where: { deletedAt: null },
        orderBy: { createdAt: "desc" },
      });
    },
  },

  Mutation: {
    createBusiness: async (
      _parent: any,
      { input }: any,
      ctx: GraphQLContext
    ) => {
      return businessService.createBusiness(input, ctx);
    },

    updateBusiness: async (
      _parent: any,
      { id, input }: { id: string; input: any },
      ctx: GraphQLContext
    ) => {
      return businessService.updateBusiness(id, input, ctx);
    },
  },

  Business: {
    region: (parent: any, _args: any, ctx: GraphQLContext) => {
      return ctx.prisma.region.findUnique({
        where: { id: parent.regionId },
      });
    },

    address: (parent: any, _args: any, ctx: GraphQLContext) => {
      if (!parent.addressId) return null;
      return ctx.prisma.address.findUnique({
        where: { id: parent.addressId },
      });
    },
  },
};
