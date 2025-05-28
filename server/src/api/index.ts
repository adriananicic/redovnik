import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import queueRouter from "../routes/queue.routes";
import authRouter from "../routes/auth.routes";
import adminRouter from "../routes/admin.routes";
import { initSocket } from "../socket";
import http from "http";
import ticketRouter from "../routes/ticket.routes";
import ServerlessHttp from "serverless-http";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/queue", queueRouter);
app.use("/api/admin", adminRouter);
app.use("/api/ticket", ticketRouter);

app.get("/", (_req, res) => res.json({ message: "Server radi 🎉" }));

app.use((err: any, _req: any, res: any, _next: any) => {
  console.error(err);
  res.status(500).json({ error: "Greška na serveru" });
});

const server = http.createServer(app);
initSocket(server);

app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from Vercel!" });
});

module.exports.handler = ServerlessHttp(app);
