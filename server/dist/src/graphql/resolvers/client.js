import { clientService } from "../../services/client.service.js";
export const clientResolvers = {
    Query: {
        clients: (_p, _a, ctx) => {
            return clientService.getAll(ctx);
        },
        client: (_p, { id }, ctx) => {
            return clientService.getById(id, ctx);
        },
    },
    Mutation: {
        createClient: (_p, { input }, ctx) => {
            return clientService.create(input, ctx);
        },
        updateClient: (_p, { id, input }, ctx) => {
            return clientService.update(id, input, ctx);
        },
        deleteClient: (_p, { id }, ctx) => {
            return clientService.delete(id, ctx);
        },
    },
    // Since our service calls don't include the 'projects' relation,
    // this relational resolver is still needed for now.
    Client: {
        projects: (parent, _a, ctx) => {
            return ctx.prisma.project.findMany({
                where: { clientId: parent.id },
            });
        },
    },
};
//# sourceMappingURL=client.js.map