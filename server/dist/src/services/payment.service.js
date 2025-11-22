// server/src/services/payment.service.ts
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export const paymentService = {
    // 🔹 Get all payments for an invoice
    async getByInvoice(invoiceId, ctx) {
        if (!ctx.user)
            throw new Error("Not authenticated"); // 🔒 TS fixed
        return prisma.payment.findMany({
            where: {
                invoiceId,
                // If businessId is not a direct field, use a relation filter or remove this line
                // business: { id: ctx.user.businessId }, // Uncomment if you have a business relation
            },
            orderBy: { date: "desc" },
        });
    },
    // 🔹 Create a new payment
    async create(input, ctx) {
        if (!ctx.user)
            throw new Error("Not authenticated");
        return prisma.payment.create({
            data: {
                ...input,
                date: input.date || new Date(),
                businessId: ctx.user.businessId, // 🔥 WORKS NOW
            },
        });
    },
    // 🔹 Update payment
    async update(id, input, ctx) {
        if (!ctx.user)
            throw new Error("Not authenticated");
        return prisma.payment.update({
            where: { id },
            data: input,
        });
    },
    // 🔹 Delete payment
    async delete(id, ctx) {
        if (!ctx.user)
            throw new Error("Not authenticated");
        return prisma.payment.delete({
            where: { id },
        });
    },
};
//# sourceMappingURL=payment.service.js.map