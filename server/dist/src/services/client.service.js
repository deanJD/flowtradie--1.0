// server/src/services/client.service.ts
export const clientService = {
    /* ----------------------------
       Get All Clients by Business
    ---------------------------- */
    getAll: async (businessId, ctx) => {
        return ctx.prisma.client.findMany({
            where: { businessId, deletedAt: null },
            orderBy: { createdAt: "desc" },
            include: { addresses: true, projects: true },
        });
    },
    /* ----------------------------
       Get Single Client by ID
    ---------------------------- */
    getById: async (id, ctx) => {
        return ctx.prisma.client.findFirst({
            where: { id, deletedAt: null },
            include: { addresses: true, projects: true },
        });
    },
    /* ----------------------------
       Create Client
    ---------------------------- */
    create: async (input, ctx) => {
        const { addresses, businessId, ...rest } = input;
        return ctx.prisma.client.create({
            data: {
                ...rest,
                business: { connect: { id: businessId } },
                ...(Array.isArray(addresses) && addresses.length > 0
                    ? {
                        addresses: {
                            create: addresses.map((addr) => ({
                                addressType: addr.addressType, // enum safe cast
                                line1: addr.line1,
                                line2: addr.line2 ?? null,
                                city: addr.city,
                                state: addr.state ?? null,
                                postcode: addr.postcode,
                                country: addr.country ?? null,
                                countryCode: addr.countryCode ?? null,
                            })),
                        },
                    }
                    : {}),
            },
            include: { addresses: true },
        });
    },
    /* ----------------------------
       Update Client (FULL REPLACE addresses)
    ---------------------------- */
    update: async (id, input, ctx) => {
        const { addresses, ...rest } = input;
        // Remove nulls → Prisma hates null values if field is optional
        const filteredInput = Object.fromEntries(Object.entries(rest).filter(([_, v]) => v !== null));
        return ctx.prisma.$transaction(async (tx) => {
            // 1️⃣ update basic fields
            await tx.client.update({
                where: { id },
                data: filteredInput,
            });
            // 2️⃣ replace addresses ONLY if provided
            if (Array.isArray(addresses)) {
                // delete existing
                await tx.address.deleteMany({
                    where: { clients: { some: { id } } },
                });
                // create new ones
                if (addresses.length > 0) {
                    await tx.address.createMany({
                        data: addresses.map((addr) => ({
                            addressType: addr.addressType,
                            line1: addr.line1,
                            line2: addr.line2 ?? null,
                            city: addr.city,
                            state: addr.state ?? null,
                            postcode: addr.postcode,
                            country: addr.country ?? null,
                            countryCode: addr.countryCode ?? null,
                        })),
                    });
                }
            }
            // 3️⃣ return updated client
            return tx.client.findUnique({
                where: { id },
                include: { addresses: true, projects: true },
            });
        });
    },
    /* ----------------------------
       Soft Delete Client
    ---------------------------- */
    delete: async (id, ctx) => {
        return ctx.prisma.client.update({
            where: { id },
            data: { deletedAt: new Date() },
            select: { id: true },
        });
    },
};
//# sourceMappingURL=client.service.js.map