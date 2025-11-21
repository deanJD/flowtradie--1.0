import { clientService } from "../../services/client.service.js";
export const clientResolvers = {
    Query: {
        clients: (_, __, ctx) => clientService.getAll(ctx),
        client: (_, { id }, ctx) => clientService.getById(id, ctx),
    },
    Mutation: {
        createClient: async (_, { input }, ctx) => {
            return clientService.create(input, ctx);
        },
        updateClient: async (_, { id, input }, ctx) => {
            return clientService.update(id, input, ctx);
        },
        deleteClient: async (_, { id }, ctx) => {
            await clientService.delete(id, ctx);
            return true;
        },
    },
};
//# sourceMappingURL=client.js.map