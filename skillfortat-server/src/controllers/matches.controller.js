import pool from "../config/db.js";
import {
  getMatchById,
  getMatchesForUser,
} from "../services/matching.service.js";

const updateMatchStatus = async (req, res, next, status) => {
  try {
    const match = await getMatchById(pool, req.params.id);

    if (
      !match ||
      (match.offer_a_user_id !== req.user.id &&
        match.offer_b_user_id !== req.user.id)
    ) {
      return res.status(404).json({ message: "Match not found" });
    }

    if (match.status !== "pending") {
      return res
        .status(409)
        .json({ message: "Match has already been handled" });
    }

    await pool.execute("UPDATE matches SET status = ? WHERE id = ?", [
      status,
      req.params.id,
    ]);

    res.json({ message: `Match ${status}`, status });
  } catch (error) {
    next(error);
  }
};

export const getMatches = async (req, res, next) => {
  try {
    const rows = await getMatchesForUser(pool, req.user.id);
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

export const acceptMatch = async (req, res, next) =>
  updateMatchStatus(req, res, next, "accepted");

export const declineMatch = async (req, res, next) =>
  updateMatchStatus(req, res, next, "declined");
