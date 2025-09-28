// src/context.ts
import { PrismaClient } from "@prisma/client";
import { decodeToken } from "./utils/jwt.js";
const prisma = new PrismaClient();
// ✅ Explicitly type req as IncomingMessage
export function buildContext({ req }) {
    const token = req.headers.authorization?.replace("Bearer ", "");
    const decoded = token ? decodeToken(token) : null;
    return {
        prisma,
        user: decoded ? { id: decoded.id, role: decoded.role } : undefined,
    };
}
//# sourceMappingURL=context.js.map