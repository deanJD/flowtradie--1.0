import { handlePrismaError } from "../utils/handlePrismaError.js"; // ✅ correct path
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
            handlePrismaError(error, "Customer creation"); // always throws -> never returns
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
//# sourceMappingURL=customer.service.js.map