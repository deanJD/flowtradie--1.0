// server/src/graphql/resolvers/business.ts
import { businessService } from "../../services/business.service.js";
export const businessResolvers = {
    Mutation: {
        createBusiness: async (_, { input }, ctx) => {
            return businessService.createBusiness(input, ctx);
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