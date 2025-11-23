import { clientService } from "../../services/client.service.js";
export const clientResolvers = {
    Query: {
        clients: async (_p, args, ctx) => {
            const { businessId } = args;
            return clientService.getAll(businessId, ctx);
        },
        client: async (_p, args, ctx) => {
            return clientService.getById(args.id, ctx);
        },
    },
    Mutation: {
        createClient: async (_p, args, ctx) => {
            return clientService.create(args.input, ctx);
        },
        updateClient: async (_p, args, ctx) => {
            return clientService.update(args.id, args.input, ctx);
        },
    },
    Client: {
        addresses: async (parent, _args, ctx) => {
            const dbAddresses = await ctx.prisma.address.findMany({
                where: { clients: { some: { id: parent.id } } },
            });
            // Ensure return type satisfies GraphQL TS typing
            return dbAddresses;
        },
    },
};
//# sourceMappingURL=client.js.map