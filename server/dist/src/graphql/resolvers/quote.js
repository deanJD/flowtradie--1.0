// src/graphql/resolvers/quote.ts
import { quoteService } from "../../services/quote.service.js";
export const quoteResolvers = {
    Query: {
        quotesByProject: (_p, { projectId }, ctx) => quoteService.getByProject(projectId, ctx),
        quote: (_p, { id }, ctx) => quoteService.getById(id, ctx),
    },
    Mutation: {
        createQuote: (_p, { input }, ctx) => quoteService.create(input, ctx),
        updateQuote: (_p, { id, input }, ctx) => quoteService.update(id, input, ctx),
        deleteQuote: (_p, { id }, ctx) => quoteService.delete(id, ctx),
    },
};
//# sourceMappingURL=quote.js.map