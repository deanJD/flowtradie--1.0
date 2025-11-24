// src/graphql/resolvers/me.ts

export const meResolvers = {
  Query: {
    me: (_p: any, _a: any, ctx: any) => {
      return ctx.user || null;
    },
  },
};
