import { createServer } from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import app from "./src/app.js";
import { registerChatHandlers } from "./src/sockets/chat.socket.js";

dotenv.config();

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || true,
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  registerChatHandlers(io, socket);
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`SkillForTat server running on http://localhost:${PORT}`);
});
