// server/services/invoiceSettings.service.ts
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export const invoiceSettingsService = {
    async get(_ctx) {
        return await prisma.invoiceSettings.findFirst();
    },
    async upsert(input, _ctx) {
        const existing = await prisma.invoiceSettings.findFirst();
        if (existing) {
            return await prisma.invoiceSettings.update({
                where: { id: existing.id },
                data: input,
            });
        }
        return await prisma.invoiceSettings.create({ data: input });
    },
};
//# sourceMappingURL=invoiceSettings.service.js.map