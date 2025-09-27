import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "super-secret-key";

export function signToken(payload: object) {
  return jwt.sign(payload, SECRET, { expiresIn: "7d" });
}

export function decodeToken(token: string) {
  try {
    return jwt.verify(token, SECRET);
  } catch {
    return null;
  }
}
