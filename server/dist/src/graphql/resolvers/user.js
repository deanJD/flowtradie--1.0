import { userService } from "../../services/user.service.js"; // <-- Import the new service
export const userResolvers = {
    Query: {
        // These now just call the service
        users: (_p, _a, ctx) => userService.getAll(ctx),
        user: (_p, { id }, ctx) => userService.getById(id, ctx),
        me: (_p, _a, ctx) => userService.getMe(ctx),
    },
    // This relational resolver is still correct
    User: {
        tasks: (parent, _a, ctx) => {
            return ctx.prisma.task.findMany({
                where: { assignedToId: parent.id },
            });
        },
    },
};
//# sourceMappingURL=user.js.map