// server/src/graphql/resolvers/me.ts
export const meResolvers = {
    Query: {
        me: (_p, _a, ctx) => {
            console.log("🧪 ctx.user inside resolver:", ctx.user); // <-- MUST log something
            return ctx.user || null;
        },
    },
};
//# sourceMappingURL=me.js.map