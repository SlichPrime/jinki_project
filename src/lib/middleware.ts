import { verifyToken } from "./auth";
import { AuthUser } from "@/types/auth";

export function getUserFromRequest(req: Request): AuthUser | null {
  const authHeader = req.headers.get("authorization");

  if (!authHeader) return null;

  // ✅ CHECK FORMAT: "Bearer TOKEN"
  if (!authHeader.startsWith("Bearer ")) return null;

  const token = authHeader.split(" ")[1];

  if (!token) return null;

  try {
    const decoded = verifyToken(token) as AuthUser;

    // ✅ ENSURE ID EXISTS
    if (!decoded?.id) return null;

    return decoded;

  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}