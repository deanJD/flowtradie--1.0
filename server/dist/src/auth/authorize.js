import { UserRole } from "@prisma/client";
export function requireAuth(ctx) {
    if (!ctx.user) {
        throw new Error("Not authenticated");
    }
}
export function requireOwnerOrAdmin(ctx) {
    requireAuth(ctx);
    if (ctx.user.role !== UserRole.OWNER && ctx.user.role !== UserRole.ADMIN) {
        throw new Error("Not authorized");
    }
}
//# sourceMappingURL=authorize.js.map