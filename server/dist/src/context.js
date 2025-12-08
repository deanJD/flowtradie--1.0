// server/src/context.ts
import { PrismaClient } from "@prisma/client";
import { decodeToken } from "./utils/jwt.js";
const prisma = new PrismaClient();
export async function buildContext({ req }) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith("Bearer ") && authHeader !== "Bearer null"
        ? authHeader.replace("Bearer ", "")
        : null;
    let dbUser = null;
    if (token) {
        try {
            // 2️⃣ SAFE CASTING
            const decoded = decodeToken(token);
            // Ensure the token actually has an ID before hitting the DB
            if (decoded && decoded.id) {
                dbUser = await prisma.user.findUnique({
                    where: { id: decoded.id },
                    select: {
                        id: true,
                        email: true,
                        role: true,
                        businessId: true,
                    },
                });
            }
        }
        catch (e) {
            // 3️⃣ SILENT FAILURE LOGGING (Don't crash, just warn)
            console.warn("⚠️ Auth Warning: Invalid or Expired JWT received");
        }
    }
    return {
        prisma,
        businessId: dbUser?.businessId ?? null,
        user: dbUser,
    };
}
//# sourceMappingURL=context.js.map