// server/src/graphql/resolvers/business.ts
import { businessService } from "../../services/business.service.js";
export const businessResolvers = {
    Query: {
        business: async (_, { id }, ctx) => {
            return ctx.prisma.business.findUnique({
                where: { id, deletedAt: null },
            });
        },
        businesses: async (_, _args, ctx) => {
            return ctx.prisma.business.findMany({
                where: { deletedAt: null },
                orderBy: { createdAt: "desc" },
            });
        },
    },
    Mutation: {
        createBusiness: async (_parent, { input }, ctx) => {
            return businessService.createBusiness(input, ctx);
        },
        updateBusiness: async (_parent, { id, input }, ctx) => {
            return businessService.updateBusiness(id, input, ctx);
        },
    },
    Business: {
        region: (parent, _args, ctx) => {
            return ctx.prisma.region.findUnique({
                where: { id: parent.regionId },
            });
        },
        address: (parent, _args, ctx) => {
            if (!parent.addressId)
                return null;
            return ctx.prisma.address.findUnique({
                where: { id: parent.addressId },
            });
        },
    },
};
//# sourceMappingURL=business.js.map