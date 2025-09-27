export function requireRole(user, allowedRoles: string[]) {
  if (!user || !allowedRoles.includes(user.role)) {
    throw new Error("Not authorized");
  }
}
