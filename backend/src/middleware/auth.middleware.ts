import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { JWT_SECRET } from "../config/auth.js";

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token) {
    return res.status(401).json({ error: "Authentication required." });
  }
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    if (typeof payload === "object" && payload !== null && "sub" in payload && typeof payload.sub === "string") {
      req.user = { sub: payload.sub };
      next();
      return;
    }
    throw new Error("Invalid token payload.");
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired token." });
  }
}
