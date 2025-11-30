// server/src/graphql/resolvers/client.ts
import {
  Resolvers,
  QueryClientsArgs,
  QueryClientArgs,
  MutationCreateClientArgs,
  MutationUpdateClientArgs,
  Client as GQLClient,
  Address as GQLAddress,
} from "@/__generated__/graphql.js";
import { GraphQLContext } from "../../context.js";
import { clientService } from "../../services/client.service.js";

export const clientResolvers: Resolvers = {
  Query: {
    clients: async (_p, args: QueryClientsArgs, ctx: GraphQLContext) => {
      const { businessId } = args;
      return clientService.getAll(businessId, ctx) as unknown as Promise<GQLClient[]>;
    },

    client: async (_p, args: QueryClientArgs, ctx: GraphQLContext) => {
      return clientService.getById(args.id, ctx) as Promise<GQLClient | null>;
    },
  },

  Mutation: {
    createClient: async (_p, args: MutationCreateClientArgs, ctx: GraphQLContext) => {
      return clientService.create(args.input, ctx) as unknown as Promise<GQLClient>;
    },

    updateClient: async (_p, args: MutationUpdateClientArgs, ctx: GraphQLContext) => {
      return clientService.update(args.id, args.input, ctx) as unknown as Promise<GQLClient>;
    },
  },

  Client: {
    addresses: async (parent: GQLClient, _args: unknown, ctx: GraphQLContext) => {
      const dbAddresses = await ctx.prisma.address.findMany({
        where: { clients: { some: { id: parent.id } } },
      });

      // Ensure return type satisfies GraphQL TS typing
      return dbAddresses as unknown as GQLAddress[];
    },
  },
};
