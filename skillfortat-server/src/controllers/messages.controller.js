import pool from "../config/db.js";
import { getMatchById } from "../services/matching.service.js";
import { getMessagesForMatch } from "../services/message.service.js";

export const getMessages = async (req, res, next) => {
  try {
    const match = await getMatchById(pool, req.params.matchId);

    if (
      !match ||
      (match.offer_a_user_id !== req.user.id &&
        match.offer_b_user_id !== req.user.id)
    ) {
      return res.status(404).json({ message: "Match not found" });
    }

    const rows = await getMessagesForMatch(pool, req.params.matchId);
    res.json(rows);
  } catch (error) {
    next(error);
  }
};
