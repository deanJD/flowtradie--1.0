// server/src/context.ts
import { PrismaClient } from "@prisma/client";
import { decodeToken } from "./utils/jwt.js";
const prisma = new PrismaClient();
export async function buildContext({ req }) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith("Bearer ") && authHeader !== "Bearer null"
        ? authHeader.replace("Bearer ", "")
        : null;
    console.log("🧾 RAW TOKEN:", token);
    let decoded = null;
    let dbUser = null;
    if (token) {
        try {
            decoded = decodeToken(token);
            console.log("🧠 Decoded user:", decoded);
            // 🔥 FETCH REAL USER FROM DATABASE
            dbUser = await prisma.user.findUnique({
                where: { id: decoded.id },
            });
            if (!dbUser) {
                console.log("❌ No user found in DB.");
            }
        }
        catch (e) {
            console.error("❌ Invalid JWT:", e);
        }
    }
    return {
        prisma,
        businessId: decoded?.businessId ?? null,
        user: dbUser
            ? {
                id: dbUser.id,
                email: dbUser.email,
                role: dbUser.role,
                businessId: dbUser.businessId,
            }
            : null, // 🧠 MUST BE NULL if NOT LOGGED IN!
    };
}
//# sourceMappingURL=context.js.map