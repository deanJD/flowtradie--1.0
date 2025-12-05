import { clientService } from "../../services/client.service.js";
export const clientResolvers = {
    // ============================================
    // QUERIES
    // ============================================
    Query: {
        clients: async (_p, args, ctx) => {
            // We know this returns a list of Client-shaped objects,
            // but TS can't match Prisma vs GraphQL types perfectly, so we cast.
            return clientService.getAll(args.businessId, ctx);
        },
        client: async (_p, args, ctx) => {
            return clientService.getById(args.id, ctx);
        },
    },
    // ============================================
    // MUTATIONS
    // ============================================
    Mutation: {
        createClient: async (_p, args, ctx) => {
            return clientService.create(args.input, ctx);
        },
        updateClient: async (_p, args, ctx) => {
            return clientService.update(args.id, args.input, ctx);
        },
        deleteClient: async (_p, args, ctx) => {
            // Soft delete in DB, then cast to GraphQL Client
            const deleted = await ctx.prisma.client.update({
                where: { id: args.id },
                data: { deletedAt: new Date() },
            });
            return deleted;
        },
    },
    // ============================================
    // CLIENT FIELD RESOLVERS
    // ============================================
    // ❗ We don't define Client.addresses / Client.projects / Client.invoices here.
    // Because:
    // - clientService.getAll/getById already includes these relations via Prisma `include`
    // - Default GraphQL resolvers will just read `parent.addresses`, `parent.projects`, `parent.invoices`
    // - Avoids strict type mismatch on nested Invoice / Project / Address shapes.
};
//# sourceMappingURL=client.js.map