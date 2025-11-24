// src/context.ts
import { PrismaClient } from "@prisma/client";
import { decodeToken } from "./utils/jwt.js";
const prisma = new PrismaClient();
export function buildContext({ req }) {
    const token = req.headers.authorization?.replace("Bearer ", "");
    const decoded = token ? decodeToken(token) : null;
    return {
        prisma,
        businessId: decoded?.businessId ?? null, // 👈 ALWAYS SET THIS
        user: decoded
            ? {
                id: decoded.id,
                role: decoded.role,
                businessId: decoded.businessId ?? null,
            }
            : undefined,
    };
}
//# sourceMappingURL=context.js.map