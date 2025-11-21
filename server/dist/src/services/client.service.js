export const clientService = {
    // 🔹 GET ALL (soft delete safe)
    getAll: (ctx) => {
        return ctx.prisma.client.findMany({
            where: { deletedAt: null, businessId: ctx.businessId },
            orderBy: { createdAt: "desc" },
            include: { address: true }, // 🆕 Include address for frontend convenience
        });
    },
    // 🔹 GET BY ID (soft delete safe)
    getById: (id, ctx) => {
        return ctx.prisma.client.findFirst({
            where: { id, deletedAt: null, businessId: ctx.businessId },
            include: { address: true },
        });
    },
    // 🔹 CREATE — with nested Address model
    create: async (input, ctx) => {
        return ctx.prisma.client.create({
            data: {
                name: input.name,
                email: input.email ?? null,
                phone: input.phone ?? null,
                businessId: ctx.businessId, // 🆕 required for multi-tenant
                // 🆕 CREATE NESTED ADDRESS ONLY IF PROVIDED
                address: input.line1
                    ? {
                        create: {
                            line1: input.line1,
                            line2: input.line2 ?? null,
                            city: input.city ?? null,
                            state: input.state ?? null,
                            postcode: input.postcode ?? null,
                            country: input.country ?? null,
                        },
                    }
                    : undefined,
            },
            include: { address: true },
        });
    },
    // 🔹 UPDATE — safely updates only provided fields
    update: async (id, input, ctx) => {
        const addressData = input.line1
            ? {
                upsert: {
                    create: {
                        line1: input.line1,
                        line2: input.line2 ?? null,
                        city: input.city ?? null,
                        state: input.state ?? null,
                        postcode: input.postcode ?? null,
                        country: input.country ?? null,
                    },
                    update: {
                        line1: input.line1 ?? undefined,
                        line2: input.line2 ?? undefined,
                        city: input.city ?? undefined,
                        state: input.state ?? undefined,
                        postcode: input.postcode ?? undefined,
                        country: input.country ?? undefined,
                    },
                },
            }
            : undefined;
        return ctx.prisma.client.update({
            where: { id },
            data: {
                name: input.name ?? undefined,
                email: input.email ?? undefined,
                phone: input.phone ?? undefined,
                address: addressData,
            },
            include: { address: true },
        });
    },
    // 🔹 SOFT DELETE
    delete: (id, ctx) => {
        return ctx.prisma.client.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    },
};
//# sourceMappingURL=client.service.js.map