import { Server } from "socket.io";
import http from "http";

export let io: Server;

export function initSocket(server: http.Server) {
  const origin = process.env.FRONTEND_ORIGIN;
  if (!origin) throw new Error("FRONTEND_ORIGIN not defined");

  io = new Server(server, {
    cors: { origin },
  });

  io.on("connection", (socket) => {
    console.log("🔌", socket.id, "connected");

    socket.on("join_queue", (queueId: string) => socket.join(queueId));
    socket.on("disconnect", () => console.log("❌", socket.id, "gone"));
  });
}
