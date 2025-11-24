// src/utils/jwt.ts
import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "secret_key"; // CHANGE LATER
// ---- Decode Token ----
export function decodeToken(token) {
    return jwt.verify(token, JWT_SECRET);
}
// ---- Encode Token ----
export function encodeToken(payload) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}
//# sourceMappingURL=jwt.js.map