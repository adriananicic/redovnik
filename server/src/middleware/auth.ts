import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  adminId?: string;
}

export function isAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Nije prijavljen" });
  }

  try {
    const { sub } = jwt.verify(header.slice(7), JWT_SECRET) as { sub: string };
    req.adminId = sub;
    next();
  } catch (err) {
    res.status(401).json({ error: "Nevažeći token" });
  }
}
