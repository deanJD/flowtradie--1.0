// src/graphql/resolvers/quote.ts
import { quoteService } from "../../services/quote.service.js";
import { GraphQLContext } from "../../context.js";

export const quoteResolvers = {
  Query: {
    quotesByJob: (_p: unknown, { jobId }: { jobId: string }, ctx: GraphQLContext) =>
      quoteService.getByJob(jobId, ctx),

    quote: (_p: unknown, { id }: { id: string }, ctx: GraphQLContext) =>
      quoteService.getById(id, ctx),
  },

  Mutation: {
    createQuote: (_p: unknown, { input }: any, ctx: GraphQLContext) =>
      quoteService.create(input, ctx),

    updateQuote: (_p: unknown, { id, input }: any, ctx: GraphQLContext) =>
      quoteService.update(id, input, ctx),

    deleteQuote: (_p: unknown, { id }: { id: string }, ctx: GraphQLContext) =>
      quoteService.delete(id, ctx),
  },
};
