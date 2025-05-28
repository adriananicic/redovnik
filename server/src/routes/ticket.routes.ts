import { Router, Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";
import { isAdmin } from "../middleware/auth";
import { io } from "../socket";

const ticketRouter = Router();

/* listaj sve tikete određenog reda */
ticketRouter.get("/:queueId", async (req, res, next) => {
  try {
    const tickets = await prisma.ticket.findMany({
      where: { queueId: req.params.queueId },
      orderBy: { number: "asc" },
    });
    res.json(tickets);
  } catch (err) {
    next(err);
  }
});

/* dohvat pojedinog tiketa */
ticketRouter.get("/one/:id", async (req, res, next) => {
  try {
    const ticket = await prisma.ticket.findUnique({
      where: { id: req.params.id },
    });
    ticket ? res.json(ticket) : res.status(404).end();
  } catch (err) {
    next(err);
  }
});

/* update statusa (ADMIN) */
ticketRouter.patch("/:id/status", isAdmin, async (req, res, next) => {
  try {
    const { status } = req.body; // WAITING | CALLED | DONE
    const updated = await prisma.ticket.update({
      where: { id: req.params.id },
      data: { status },
      include: { counter: true },
    });

    /* real-time emit */
    io.to(updated.queueId).emit("ticket_updated", updated);

    res.json(updated);
  } catch (err) {
    next(err);
  }
});

/* brisanje (ADMIN) */
ticketRouter.delete("/:id", isAdmin, async (req, res, next) => {
  try {
    await prisma.ticket.delete({ where: { id: req.params.id } });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

export default ticketRouter;
