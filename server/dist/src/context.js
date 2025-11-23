// src/context.ts
import { PrismaClient } from "@prisma/client";
import { decodeToken } from "./utils/jwt.js";
const prisma = new PrismaClient();
export function buildContext({ req }) {
    const token = req.headers.authorization?.replace("Bearer ", "");
    const decoded = token ? decodeToken(token) : null;
    return {
        businessId: decoded?.businessId ?? null,
        prisma,
        user: decoded
            ? {
                id: decoded.id,
                role: decoded.role,
                businessId: decoded.businessId, // 🚨 NEEDED FOR PAYMENTS/INVOICES
            }
            : undefined,
    };
}
//# sourceMappingURL=context.js.map