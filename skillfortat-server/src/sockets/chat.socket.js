import pool from "../config/db.js";
import { createMessage } from "../services/message.service.js";
import { getMatchById } from "../services/matching.service.js";

export const registerChatHandlers = (io, socket) => {
  socket.on("join_match", async ({ matchId }) => {
    if (!matchId) {
      return;
    }

    socket.join(`match:${matchId}`);
  });

  socket.on("leave_match", ({ matchId }) => {
    if (!matchId) {
      return;
    }

    socket.leave(`match:${matchId}`);
  });

  socket.on("send_message", async (ack, payload = {}) => {
    try {
      const { matchId, senderId, body } = payload;

      if (!matchId || !senderId || !body?.trim()) {
        if (typeof ack === "function") {
          ack({ message: "Invalid message payload" });
        }

        return;
      }

      const match = await getMatchById(pool, matchId);

      if (
        !match ||
        (match.offer_a_user_id !== senderId &&
          match.offer_b_user_id !== senderId)
      ) {
        if (typeof ack === "function") {
          ack({ message: "Match not found" });
        }

        return;
      }

      const message = await createMessage(pool, {
        matchId,
        senderId,
        body: body.trim(),
      });

      io.to(`match:${matchId}`).emit("message:new", message);

      if (typeof ack === "function") {
        ack({ message });
      }
    } catch (error) {
      if (typeof ack === "function") {
        ack({ message: error.message || "Failed to send message" });
      }
    }
  });
};
