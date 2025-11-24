import { authService } from "../../services/auth.service.js";
export const authResolvers = {
    Mutation: {
        login: (_p, { input }, ctx) => {
            return authService.login(input);
        },
        register: (_p, { input }, ctx) => {
            return authService.register(input);
        },
    },
};
//# sourceMappingURL=auth.js.map