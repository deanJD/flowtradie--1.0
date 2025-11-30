// src/graphql/resolvers/me.ts
export const meResolvers = {
  Query: {
    me: async (_p: any, _a: any, ctx: any) => {
      if (!ctx.user) return null; // Not authenticated

      // Fetch full user from DB using decoded token ID
      return await ctx.prisma.user.findUnique({
        where: { id: ctx.user.id },
      });
    },
  },
};
