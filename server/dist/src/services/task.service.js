import { Prisma } from "@prisma/client";
// Define the 'include' object once to keep our code DRY
const taskInclude = {
    assignedTo: true,
    project: true,
};
export const taskService = {
    getAllByProject: (projectId, ctx) => {
        return ctx.prisma.task.findMany({
            where: {
                projectId,
                deletedAt: null, // <-- CHANGED
            },
            orderBy: { createdAt: "desc" },
            include: taskInclude,
        });
    },
    getById: (id, ctx) => {
        // CHANGED: Use findFirst to ensure we don't fetch a deleted task
        return ctx.prisma.task.findFirst({
            where: {
                id,
                deletedAt: null,
            },
            include: taskInclude,
        });
    },
    create: async (input, ctx) => {
        try {
            return await ctx.prisma.task.create({
                data: input,
                include: taskInclude,
            });
        }
        catch (error) {
            // Keep your excellent error handling for invalid foreign keys
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2003") {
                throw new Error("Invalid projectId or assignedToId. The Project or User does not exist.");
            }
            throw error;
        }
    },
    update: (id, input, ctx) => {
        // Manually build the data object to handle nulls and relations
        const data = {
            title: input.title ?? undefined,
            description: input.description ?? undefined,
            isCompleted: input.isCompleted ?? undefined,
            dueDate: input.dueDate ?? undefined,
            assignedTo: input.assignedToId === null
                ? { disconnect: true }
                : input.assignedToId
                    ? { connect: { id: input.assignedToId } }
                    : undefined,
        };
        return ctx.prisma.task.update({
            where: { id },
            data: data,
            include: taskInclude,
        });
    },
    delete: (id, ctx) => {
        // CHANGED: This is now a soft delete
        return ctx.prisma.task.update({
            where: { id },
            data: {
                deletedAt: new Date(),
            },
        });
    },
};
export const clientService = {
    getAll: async (businessId, ctx) => {
        return ctx.prisma.client.findMany({
            where: { businessId, deletedAt: null },
            orderBy: { createdAt: "desc" },
            include: { addresses: true, projects: true },
        });
    },
    getById: async (id, ctx) => {
        return ctx.prisma.client.findFirst({
            where: { id, deletedAt: null },
            include: { addresses: true, projects: true },
        });
    },
    // --------------------- CREATE CLIENT ---------------------
    create: async (input, ctx) => {
        const { addresses, businessId, ...rest } = input;
        return ctx.prisma.client.create({
            data: {
                ...rest,
                business: { connect: { id: businessId } },
                ...(addresses && addresses.length > 0
                    ? {
                        addresses: {
                            create: addresses.map((addr) => ({
                                ...addr,
                                addressType: addr.addressType, // 👈 FIX: enum safely converted
                            })),
                        },
                    }
                    : {}),
            },
            include: { addresses: true },
        });
    },
    /* ----------------------------
       Update Client
    ---------------------------- */
    /* ----------------------------
       Update Client
    ---------------------------- */
    update: async (id, input, ctx) => {
        const { addresses, ...rest } = input;
        // 🟢 Filter out null fields safely
        const filteredInput = Object.fromEntries(Object.entries(rest).filter(([_, v]) => v !== null));
        return ctx.prisma.$transaction(async (tx) => {
            // 1️⃣ Update base client fields
            await tx.client.update({
                where: { id },
                data: filteredInput,
            });
            // 2️⃣ If addresses were provided → replace them fully
            if (addresses != null) { // ✔ null-safe check
                // Delete all existing linked addresses
                await tx.address.deleteMany({
                    where: { clients: { some: { id } } },
                });
                if (addresses.length > 0) {
                    await tx.address.createMany({
                        data: addresses.map((addr) => ({
                            addressType: addr.addressType, // ENUM FIX
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
            // 3️⃣ Return the client with new addresses
            return tx.client.findUnique({
                where: { id },
                include: { addresses: true },
            });
        }); // closes $transaction
    },
}; // closes update method
//# sourceMappingURL=task.service.js.map