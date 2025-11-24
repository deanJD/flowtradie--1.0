// src/graphql/resolvers/me.ts
export const meResolvers = {
    Query: {
        me: (_p, _a, ctx) => {
            return ctx.user || null;
        },
    },
};
//# sourceMappingURL=me.js.map