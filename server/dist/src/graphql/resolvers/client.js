import { clientService } from "../../services/client.service.js";
export const clientResolvers = {
    Query: {
        clients: async (_p, args, ctx) => {
            const { businessId } = args;
            return (await clientService.getAll(businessId, ctx));
        },
        client: async (_p, args, ctx) => {
            return (await clientService.getById(args.id, ctx));
        },
    },
    Mutation: {
        createClient: async (_p, args, ctx) => {
            return (await clientService.create(args.input, ctx));
        },
        updateClient: async (_p, args, ctx) => {
            return (await clientService.update(args.id, args.input, ctx));
        },
    },
    Client: {
        addresses: async (parent, _args, ctx) => {
            return ctx.prisma.address.findMany({
                where: { clients: { some: { id: parent.id } } },
            });
        },
    },
};
//# sourceMappingURL=client.js.map