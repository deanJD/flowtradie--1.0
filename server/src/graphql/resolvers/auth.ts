// src/graphql/resolvers/auth.resolver.ts
import { authService } from "../../services/auth.service.js";
import { GraphQLContext } from "../../context.js";
import { User } from "@prisma/client";

interface RegisterArgs {
  input: {
    name: string;
    email: string;
    password: string;
  };
}

interface LoginArgs {
  input: {
    email: string;
    password: string;
  };
}

export const authResolvers = {
  Mutation: {
    register: async (
      _p: unknown,
      args: RegisterArgs,
      _ctx: GraphQLContext
    ): Promise<{ token: string; user: User }> => {
      const user = await authService.register(args.input);
      const token = await authService.login({
        email: args.input.email,
        password: args.input.password,
      });
      return { token, user };
    },

    login: async (
      _p: unknown,
      args: LoginArgs,
      _ctx: GraphQLContext
    ): Promise<{ token: string; user: User }> => {
      const user = await authService.login(args.input);
      const foundUser = await _ctx.prisma.user.findUnique({
        where: { email: args.input.email },
      });
      if (!foundUser) throw new Error("User not found");
      return { token: user, user: foundUser };
    },
  },
};
