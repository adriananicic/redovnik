import { PrismaClient, TicketStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

/* ───────────────── Professors / admins ───────────────── */
const admins = [
  {
    email: "boris.uzelac@fer.hr",
    name: "dr. sc. Boris Uzelac",
    queues: [
      {
        name: "Uvid Fizika 1",
        location: "D272",
        inHours: 1,
        tickets: 10,
        called: 3,
        done: 0,
      },
    ],
  },
  {
    email: "marija.bozic@fer.hr",
    name: "dr. sc. Marija Božić",
    queues: [
      {
        name: "Uvid Matematika 1",
        location: "D160",
        inHours: 2,
        tickets: 8,
        called: 2,
        done: 1,
      },
    ],
  },
  {
    email: "ivan.horvat@fer.hr",
    name: "doc. dr. sc. Ivan Horvat",
    queues: [
      {
        name: "Konzultacije RP",
        location: "C012",
        inHours: 0.5,
        tickets: 5,
        called: 0,
        done: 0,
      },
      {
        name: "Konzultacije OE",
        location: "C013",
        inHours: 3,
        tickets: 5,
        called: 0,
        done: 0,
      },
    ],
  },
];

const plainPwd = "fer12345"; // svi imaju istu lozinku
async function seed() {
  const hash = await bcrypt.hash(plainPwd, 10);

  for (const prof of admins) {
    /* upsert admin */
    const admin = await prisma.admin.upsert({
      where: { email: prof.email },
      update: { name: prof.name, password: hash },
      create: { email: prof.email, name: prof.name, password: hash },
    });

    /* za svakog queue provjeri postoji li već */
    for (const q of prof.queues) {
      const exists = await prisma.queue.findFirst({ where: { name: q.name } });
      if (exists) continue;

      const ticketsData = Array.from({ length: q.tickets }).map((_, i) => {
        let status: TicketStatus = "WAITING";
        if (i < q.called) status = "CALLED";
        else if (i >= q.tickets - q.done) status = "DONE";
        return { number: i + 1, status };
      });

      await prisma.queue.create({
        data: {
          name: q.name,
          location: q.location,
          startsAt: new Date(Date.now() + q.inHours * 3600_000),
          creatorId: admin.id,
          tickets: { createMany: { data: ticketsData } },
        },
      });
    }
  }

  console.log("✅  Seed završen (admini + queue-ovi + ticketi).");
}

seed()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
