import jwt from "jsonwebtoken";
import pool from "../config/db.js";

const extractToken = (header = "") => {
  if (!header.startsWith("Bearer ")) {
    return null;
  }

  return header.slice(7).trim();
};

export const protect = async (req, res, next) => {
  const token = extractToken(req.headers.authorization);

  if (!token) {
    return res.status(401).json({ message: "Not authorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const [rows] = await pool.execute(
      "SELECT id, username, email, bio, created_at FROM users WHERE id = ?",
      [decoded.id],
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: "Not authorized" });
    }

    req.user = rows[0];
    next();
  } catch {
    return res.status(401).json({ message: "Not authorized" });
  }
};
