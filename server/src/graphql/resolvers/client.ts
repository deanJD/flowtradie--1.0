// server/src/graphql/resolvers/client.ts
import {
  Resolvers,
  QueryClientsArgs,   // list
  QueryClientArgs,    // ❗ single client – THIS is the correct name
  MutationCreateClientArgs,
  MutationUpdateClientArgs,
} from "@/__generated__/graphql.js";
import { GraphQLContext } from "../../context.js";
import { clientService } from "../../services/client.service.js";

export const clientResolvers: Resolvers = {
  Query: {
    clients: async (_p, args: QueryClientsArgs, ctx: GraphQLContext) => {
      const { businessId } = args;
      return (await clientService.getAll(businessId, ctx)) as any;
    },

    client: async (_p, args: QueryClientArgs, ctx: GraphQLContext) => {
      return (await clientService.getById(args.id, ctx)) as any;
    },
  },

  Mutation: {
    createClient: async (_p, args: MutationCreateClientArgs, ctx: GraphQLContext) => {
      return (await clientService.create(args.input, ctx)) as any;
    },

    updateClient: async (_p, args: MutationUpdateClientArgs, ctx: GraphQLContext) => {
      return (await clientService.update(args.id, args.input, ctx)) as any;
    },
  },

  Client: {
    addresses: async (parent: any, _args: unknown, ctx: GraphQLContext) => {
      return ctx.prisma.address.findMany({
        where: { clients: { some: { id: parent.id } } },
      });
    },
  },
};