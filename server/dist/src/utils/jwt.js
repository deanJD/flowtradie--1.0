// server/src/utils/jwt.ts
import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "secret_key"; // fallback
export function decodeToken(token) {
    return jwt.verify(token, JWT_SECRET);
}
export function encodeToken(payload) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}
//# sourceMappingURL=jwt.js.map