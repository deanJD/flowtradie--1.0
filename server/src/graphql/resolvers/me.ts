// server/src/graphql/resolvers/me.ts
export const meResolvers = {
  Query: {
    me: (_p: any, _a: any, ctx: any) => {
      console.log("🧪 ctx.user inside resolver:", ctx.user); // <-- MUST log something
      return ctx.user || null;
    },
  },
};
