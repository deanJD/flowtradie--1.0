export const companySettingsService = {
    get: (ctx) => {
        return ctx.prisma.companySettings.findFirst();
    },
    upsert: async (input, ctx) => {
        const existing = await ctx.prisma.companySettings.findFirst();
        if (existing) {
            return ctx.prisma.companySettings.update({
                where: { id: existing.id },
                data: input,
            });
        }
        return ctx.prisma.companySettings.create({ data: input });
    },
};
//# sourceMappingURL=companySettings.service.js.map