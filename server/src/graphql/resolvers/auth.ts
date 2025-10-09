// server/src/graphql/resolvers/auth.ts
import { GraphQLContext } from "../../context.js";
import { authService } from "../../services/auth.service.js";
import { RegisterInput, LoginInput } from "@/__generated__/graphql.js";

export const authResolvers = {
  Mutation: {
    // This resolver now correctly creates a user, then logs them in,
    // and returns the AuthPayload the schema expects.
    register: async (
      _p: unknown,
      { input }: { input: RegisterInput },
      ctx: GraphQLContext
    ) => {
      // 1. Create the new user in the database
      await authService.register(input, ctx);

      // 2. Log the new user in to get a token and user object
      const authPayload = await authService.login(
        { email: input.email, password: input.password },
        ctx
      );

      // 3. Return the complete payload
      return authPayload;
    },

    // This resolver is now a simple one-liner. The service does all the work.
    login: async (
      _p: unknown,
      { input }: { input: LoginInput },
      ctx: GraphQLContext
    ) => {
      return authService.login(input, ctx);
    },
  },
};