import { handlePrismaError } from "../../utils/handlePrismaError.js";
// ✅ Actual resolvers
export const customerResolvers = {
    Query: {
        customers: (_p, _a, ctx) => customerService.getAll(ctx),
        customer: (_p, args, ctx) => customerService.getById(args.id, ctx),
    },
    Mutation: {
        createCustomer: (_p, args, ctx) => customerService.create(args.input, ctx),
        updateCustomer: (_p, args, ctx) => customerService.update(args.id, args.input, ctx),
        deleteCustomer: (_p, args, ctx) => customerService.delete(args.id, ctx),
    },
};
// ✅ Keep your service
export const customerService = {
    getAll: async (ctx) => {
        return ctx.prisma.customer.findMany({ orderBy: { createdAt: "desc" } });
    },
    getById: async (id, ctx) => {
        return ctx.prisma.customer.findUnique({ where: { id } });
    },
    create: async (input, ctx) => {
        try {
            return await ctx.prisma.customer.create({ data: input });
        }
        catch (error) {
            handlePrismaError(error, "Customer creation");
        }
    },
    update: async (id, input, ctx) => {
        try {
            return await ctx.prisma.customer.update({ where: { id }, data: input });
        }
        catch (error) {
            handlePrismaError(error, "Customer update");
        }
    },
    delete: async (id, ctx) => {
        try {
            return await ctx.prisma.customer.delete({ where: { id } });
        }
        catch (error) {
            handlePrismaError(error, "Customer deletion");
        }
    },
};
//# sourceMappingURL=customer.js.map