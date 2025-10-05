// server/src/graphql/resolvers/client.ts
import { GraphQLContext } from "../../context.js";
import { clientService } from "../../services/client.service.js";
import { CreateClientInput, UpdateClientInput } from "@/__generated__/graphql.js";

export const clientResolvers = {
  Query: {
    clients: (_p: unknown, _a: unknown, ctx: GraphQLContext) => {
      return clientService.getAll(ctx);
    },
    client: (_p: unknown, { id }: { id: string }, ctx: GraphQLContext) => {
      return clientService.getById(id, ctx);
    },
  },
  Mutation: {
    createClient: (
      _p: unknown,
      { input }: { input: CreateClientInput },
      ctx: GraphQLContext
    ) => {
      return clientService.create(input, ctx);
    },
    updateClient: (
      _p: unknown,
      { id, input }: { id: string; input: UpdateClientInput },
      ctx: GraphQLContext
    ) => {
      return clientService.update(id, input, ctx);
    },
    deleteClient: (
      _p: unknown,
      { id }: { id: string },
      ctx: GraphQLContext
    ) => {
      return clientService.delete(id, ctx);
    },
  },

  // Since our service calls don't include the 'projects' relation,
  // this relational resolver is still needed for now.
  Client: {
    projects: (parent: { id: string }, _a: unknown, ctx: GraphQLContext) => {
      return ctx.prisma.project.findMany({
        where: { clientId: parent.id },
      });
    },
  },
};