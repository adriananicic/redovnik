import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";
import { isAdmin, AuthRequest } from "../middleware/auth";

const adminRouter = Router();

adminRouter.post("/", isAdmin, async (req: AuthRequest, res: Response) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name)
    return res.status(400).json({ error: "email, password, name obavezni" });

  const already = await prisma.admin.findUnique({ where: { email } });
  if (already) return res.status(409).json({ error: "E-mail već postoji" });

  const hash = await bcrypt.hash(password, 10);

  const newAdmin = await prisma.admin.create({
    data: { email, password: hash, name },
    select: { id: true, email: true, name: true },
  });

  res.status(201).json(newAdmin);
});

adminRouter.get("/counters", isAdmin, async (req: AuthRequest, res) => {
  const counters = await prisma.counter.findMany({
    where: { adminId: req.adminId },
    include: {
      queue: {
        include: {
          tickets: true,
        },
      },
    },
  });

  res.json(counters);
});

export default adminRouter;
