// src/middleware/permissions.ts
import { UserRole } from "@prisma/client";

interface UserContext {
  id: string;
  role: UserRole;
}

export function requireRole(user: UserContext | undefined, allowedRoles: UserRole[]) {
  if (!user) {
    throw new Error("Not authenticated");
  }
  if (!allowedRoles.includes(user.role)) {
    throw new Error("Not authorized");
  }
}
