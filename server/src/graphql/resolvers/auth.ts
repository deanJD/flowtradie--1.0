// src/graphql/resolvers/auth.ts
import { GraphQLContext } from "../../context.js";
import { authService } from "../../services/auth.service.js";
import {
  LoginInput,
  RegisterInput,
  MutationLoginArgs,
  MutationRegisterArgs,
} from "@/__generated__/graphql.js";

export const authResolvers = {
  Mutation: {
    login: (_p: unknown, { input }: MutationLoginArgs, ctx: GraphQLContext) => {
      return authService.login(input);
    },

    register: (_p: unknown, { input }: MutationRegisterArgs, ctx: GraphQLContext) => {
      return authService.register(input);
    },
  },
};
