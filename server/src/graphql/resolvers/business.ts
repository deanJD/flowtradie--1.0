// server/src/graphql/resolvers/business.ts
import { businessService } from "../../services/business.service.js";
import { GraphQLContext } from "../../context.js";

export const businessResolvers = {
  Mutation: {
    createBusiness: async (_: any, { input }: any, ctx: GraphQLContext) => {
      return businessService.createBusiness(input, ctx);
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
