export function requireRole(user, allowedRoles) {
    if (!user) {
        throw new Error("Not authenticated");
    }
    if (!allowedRoles.includes(user.role)) {
        throw new Error("Not authorized");
    }
}
//# sourceMappingURL=permissions.js.map