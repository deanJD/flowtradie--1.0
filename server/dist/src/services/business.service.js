import { AddressType } from "@prisma/client";
export const businessService = {
    // -------------------------
    // 1) Get ALL (Unchanged)
    // -------------------------
    getAll: async (ctx) => {
        return ctx.prisma.business.findMany({
            where: { deletedAt: null },
            orderBy: { createdAt: "desc" },
            include: { region: true, address: true },
        });
    },
    // -------------------------
    // 2) Get by ID (Unchanged)
    // -------------------------
    getById: async (id, ctx) => {
        return ctx.prisma.business.findUnique({
            where: { id, deletedAt: null },
            include: { region: true, address: true },
        });
    },
    // -------------------------
    // 3) CREATE BUSINESS
    // -------------------------
    createBusiness: async (input, ctx) => {
        const { address, 
        // ❌ REMOVED: registrationNumber
        businessNumber, // ✅ EXTRACTED: We pull this out of input so we can use it
        ...businessData } = input;
        return ctx.prisma.business.create({
            data: {
                ...businessData,
                // ✅ ASSIGNED: Now we use the variable we extracted above
                businessNumber: businessNumber,
                address: address ? {
                    create: {
                        ...address,
                        addressType: AddressType.BUSINESS
                    }
                } : undefined
            },
            include: {
                region: true,
                address: true,
            },
        });
    },
    // -------------------------
    // 4) UPDATE BUSINESS
    // -------------------------
    updateBusiness: async (id, input, ctx) => {
        const { address, 
        // ❌ REMOVED: registrationNumber
        businessNumber, // ✅ EXTRACTED
        ...businessData } = input;
        return ctx.prisma.business.update({
            where: { id },
            data: {
                ...businessData,
                // ✅ ASSIGNED
                businessNumber: businessNumber,
                address: address ? {
                    upsert: {
                        create: { ...address, addressType: AddressType.BUSINESS },
                        update: { ...address }
                    }
                } : undefined
            },
            include: {
                region: true,
                address: true,
            },
        });
    },
};
//# sourceMappingURL=business.service.js.map