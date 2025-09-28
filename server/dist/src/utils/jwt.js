import jwt from "jsonwebtoken";
const SECRET = process.env.JWT_SECRET || "super-secret-key";
export function signToken(payload) {
    return jwt.sign(payload, SECRET, { expiresIn: "7d" });
}
export function decodeToken(token) {
    try {
        return jwt.verify(token, SECRET);
    }
    catch {
        return null;
    }
}
//# sourceMappingURL=jwt.js.map