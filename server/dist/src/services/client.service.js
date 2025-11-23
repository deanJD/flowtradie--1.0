// server/src/services/client.service.ts
export const clientService = {
    /* ----------------------------
       Get All Clients by Business
    ---------------------------- */
    getAll: async (businessId, ctx) => {
        const clients = await ctx.prisma.client.findMany({
            where: { businessId, deletedAt: null },
            orderBy: { createdAt: "desc" },
            include: { addresses: true, projects: true },
        });
        return clients;
    },
    /* ----------------------------
       Get Single Client by ID
    ---------------------------- */
    getById: async (id, ctx) => {
        const client = await ctx.prisma.client.findFirst({
            where: { id, deletedAt: null },
            include: { addresses: true, projects: true },
        });
        return client;
    },
    /* ----------------------------
       Create Client
    ---------------------------- */
    create: async (input, ctx) => {
        const { addresses, businessId, type, ...rest } = input;
        return ctx.prisma.client.create({
            data: {
                ...rest, // name, phone, email, notes, etc.
                type: type ?? undefined, // Prisma hates null for enums
                business: { connect: { id: businessId } },
                ...(Array.isArray(addresses) && addresses.length > 0
                    ? {
                        addresses: {
                            create: addresses.map((addr) => ({
                                addressType: addr.addressType,
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
            include: { addresses: true, projects: true },
        });
    },
    /* ----------------------------
       Update Client (FULL REPLACE addresses)
    ---------------------------- */
    update: async (id, input, ctx) => {
        const { addresses, type, ...rest } = input;
        // Filter out nulls for optional fields
        const filteredInput = Object.fromEntries(Object.entries(rest).filter(([_, v]) => v !== null));
        return ctx.prisma.$transaction(async (tx) => {
            // 1️⃣ update basic fields (ensure enum is correct)
            await tx.client.update({
                where: { id },
                data: {
                    ...filteredInput,
                    type: type ?? undefined,
                },
            });
            // 2️⃣ Replace addresses if provided
            if (Array.isArray(addresses)) {
                await tx.address.deleteMany({
                    where: { clients: { some: { id } } },
                });
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
            // 3️⃣ return final updated client
            const updated = await tx.client.findUnique({
                where: { id },
                include: { addresses: true, projects: true },
            });
            return updated;
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