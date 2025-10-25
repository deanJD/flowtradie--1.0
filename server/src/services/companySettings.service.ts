import type { GraphQLContext } from "../context.js";

export const companySettingsService = {
  get: (ctx: GraphQLContext) => {
    return ctx.prisma.companySettings.findFirst();
  },

  upsert: async (input: any, ctx: GraphQLContext) => {
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
