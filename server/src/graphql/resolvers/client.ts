// server/src/graphql/resolvers/client.ts
import {
  Resolvers,
  QueryClientsArgs,
  QueryClientArgs,
  MutationCreateClientArgs,
  MutationUpdateClientArgs,
  MutationDeleteClientArgs,
  Client as GQLClient,
} from "@/__generated__/graphql.js";

import { GraphQLContext } from "../../context.js";
import { clientService } from "../../services/client.service.js";

export const clientResolvers = {

  // ============================================
  // QUERIES
  // ============================================
  Query: {
    clients: async (
      _p: unknown,
      args: QueryClientsArgs,
      ctx: GraphQLContext
    ) => {
      // We know this returns a list of Client-shaped objects,
      // but TS can't match Prisma vs GraphQL types perfectly, so we cast.
      return clientService.getAll(
        args.businessId,
        ctx
      ) as unknown as Promise<GQLClient[]>;
    },

    client: async (
      _p: unknown,
      args: QueryClientArgs,
      ctx: GraphQLContext
    ) => {
      return clientService.getById(
        args.id,
        ctx
      ) as unknown as Promise<GQLClient | null>;
    },
  },

  // ============================================
  // MUTATIONS
  // ============================================
  Mutation: {
    createClient: async (
      _p: unknown,
      args: MutationCreateClientArgs,
      ctx: GraphQLContext
    ) => {
      return clientService.create(
        args.input,
        ctx
      ) as unknown as Promise<GQLClient>;
    },

    updateClient: async (
      _p: unknown,
      args: MutationUpdateClientArgs,
      ctx: GraphQLContext
    ) => {
      return clientService.update(
        args.id,
        args.input,
        ctx
      ) as unknown as Promise<GQLClient>;
    },

    deleteClient: async (
      _p: unknown,
      args: MutationDeleteClientArgs,
      ctx: GraphQLContext
    ) => {
      // Soft delete in DB, then cast to GraphQL Client
      const deleted = await ctx.prisma.client.update({
        where: { id: args.id },
        data: { deletedAt: new Date() },
      });

      return deleted as unknown as GQLClient;
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
