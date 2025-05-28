import { Router } from "express";
import { isAdmin, AuthRequest } from "../middleware/auth";
import { io } from "../socket";
import { prisma } from "../lib/prisma";

const queueRouter = Router();

/* svi redovi */
queueRouter.get("/", async (_req, res, next) => {
  try {
    const queues = await prisma.queue.findMany({
      orderBy: { startsAt: "desc" },
      select: { id: true, name: true, location: true, startsAt: true },
    });
    res.json(queues);
  } catch (err) {
    next(err);
  }
});

/* admin poziva sljedeći broj sa SVOG šaltera */
queueRouter.post(
  "/:counterId/call-next",
  isAdmin,
  async (req: AuthRequest, res, next) => {
    try {
      const counter = await prisma.counter.findUnique({
        where: { id: req.params.counterId },
        select: { id: true, queueId: true, adminId: true },
      });

      if (!counter || counter.adminId !== req.adminId) {
        return res.status(403).json({ error: "Nemaš pristup tom šalteru" });
      }

      await prisma.ticket.updateMany({
        where: {
          counterId: counter.id,
          status: "CALLED",
        },
        data: {
          status: "DONE",
        },
      });

      const nextTicket = await prisma.ticket.findFirst({
        where: {
          queueId: counter.queueId,
          status: "WAITING",
        },
        orderBy: { number: "asc" },
      });

      if (!nextTicket) {
        return res.json({ message: "Nema više brojeva" });
      }

      const updated = await prisma.ticket.update({
        where: { id: nextTicket.id },
        data: { status: "CALLED", counterId: counter.id },
        include: { counter: true },
      });

      io.to(counter.queueId).emit("ticket_called", updated);
      res.json(updated);
    } catch (err) {
      next(err);
    }
  }
);

/* student uzima broj */
queueRouter.post("/:id/ticket", async (req, res, next) => {
  try {
    const last = await prisma.ticket.findFirst({
      where: { queueId: req.params.id },
      orderBy: { number: "desc" },
    });
    const t = await prisma.ticket.create({
      data: { number: (last?.number ?? 0) + 1, queueId: req.params.id },
    });
    io.to(req.params.id).emit("ticket_taken");
    res.json(t);
  } catch (err) {
    next(err);
  }
});

/* jedan red + šalteri + tiketi */
queueRouter.get("/:id", async (req, res, next) => {
  try {
    const queue = await prisma.queue.findUnique({
      where: { id: req.params.id },
      include: {
        counters: {
          select: {
            id: true,
            tickets: true,
            label: true,
            admin: { select: { name: true } },
          },
        },
        tickets: {
          orderBy: { number: "asc" },
          include: { counter: { select: { id: true, label: true } } },
        },
      },
    });
    queue
      ? res.json(queue)
      : res.status(404).json({ error: "Red nije pronađen" });
  } catch (err) {
    next(err);
  }
});

/* kreiranje reda + šaltera (ADMIN) */
queueRouter.post("/", isAdmin, async (req: AuthRequest, res, next) => {
  try {
    const { name, location, startsAt, counters } = req.body;
    if (!counters?.length)
      return res.status(400).json({ error: "Treba bar 1 šalter" });

    const admins = await prisma.admin.findMany({
      where: { email: { in: counters.map((c: any) => c.adminEmail) } },
    });
    const counterData = counters.map((c: any) => {
      const a = admins.find((x) => x.email === c.adminEmail);
      if (!a) throw new Error(`Admin ${c.adminEmail} ne postoji`);
      return { label: c.label, adminId: a.id };
    });

    const queue = await prisma.queue.create({
      data: {
        name,
        location,
        startsAt: new Date(startsAt),
        creatorId: req.adminId!,
        counters: { createMany: { data: counterData } },
      },
      include: { counters: true },
    });
    res.json(queue);
  } catch (err) {
    next(err);
  }
});

queueRouter.delete("/:id", isAdmin, async (req: AuthRequest, res, next) => {
  try {
    await prisma.queue.delete({
      where: { id: req.params.id },
    });
    res.json({ message: "Red obrisan" });
  } catch (err) {
    next(err);
  }
});

export default queueRouter;
