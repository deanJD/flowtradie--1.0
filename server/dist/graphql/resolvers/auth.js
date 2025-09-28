// src/graphql/resolvers/auth.resolver.ts
import { authService } from "../../services/auth.service.js";
export const authResolvers = {
    Mutation: {
        register: async (_p, args, _ctx) => {
            const user = await authService.register(args.input);
            const token = await authService.login({
                email: args.input.email,
                password: args.input.password,
            });
            return { token, user };
        },
        login: async (_p, args, _ctx) => {
            const user = await authService.login(args.input);
            const foundUser = await _ctx.prisma.user.findUnique({
                where: { email: args.input.email },
            });
            if (!foundUser)
                throw new Error("User not found");
            return { token: user, user: foundUser };
        },
    },
};
//# sourceMappingURL=auth.js.map