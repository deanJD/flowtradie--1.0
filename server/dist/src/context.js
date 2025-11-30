// server/src/context.ts
import { PrismaClient } from "@prisma/client";
import { decodeToken } from "./utils/jwt.js";
const prisma = new PrismaClient();
export async function buildContext({ req }) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith("Bearer ") && authHeader !== "Bearer null"
        ? authHeader.replace("Bearer ", "")
        : null;
    let decoded = null;
    let dbUser = null;
    if (token) {
        try {
            decoded = decodeToken(token);
            dbUser = await prisma.user.findUnique({
                where: { id: decoded.id },
                select: {
                    id: true,
                    email: true,
                    role: true,
                    businessId: true, // ⚡ REQUIRED FOR PROJECTS / INVOICES / ALL
                },
            });
        }
        catch (e) {
            console.error("❌ Invalid JWT:", e);
        }
    }
    return {
        prisma,
        businessId: dbUser?.businessId ?? null, // ✔ NOW CONTEXT HAS IT
        user: dbUser,
    };
}
//# sourceMappingURL=context.js.map