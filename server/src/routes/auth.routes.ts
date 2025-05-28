import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";
const authRouter = Router();

authRouter.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const admin = await prisma.admin.findUnique({ where: { email } });

  if (!admin || !(await bcrypt.compare(password, admin.password))) {
    return res.status(401).json({ error: "Neispravni podaci" });
  }

  const token = jwt.sign({ sub: admin.id }, JWT_SECRET, { expiresIn: "8h" });

  res.json({ token, name: admin.name });
});

export default authRouter;
