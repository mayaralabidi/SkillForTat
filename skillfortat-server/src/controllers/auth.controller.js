import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { validationResult } from "express-validator";
import pool from "../config/db.js";

const signToken = (id, username) =>
  jwt.sign({ id, username }, process.env.JWT_SECRET, { expiresIn: "7d" });

export const register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { username, email, password } = req.body;

    const [existing] = await pool.execute(
      "SELECT id FROM users WHERE email = ? OR username = ?",
      [email, username],
    );
    if (existing.length > 0) {
      return res
        .status(409)
        .json({ message: "Email or username already in use" });
    }

    const password_hash = await bcrypt.hash(password, 12);
    const id = uuidv4();

    await pool.execute(
      "INSERT INTO users (id, username, email, password_hash) VALUES (?, ?, ?, ?)",
      [id, username, email, password_hash],
    );

    const token = signToken(id, username);
    res.status(201).json({ token, user: { id, username, email } });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;

    const [[user]] = await pool.execute(
      "SELECT id, username, email, password_hash FROM users WHERE email = ?",
      [email],
    );
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    const token = signToken(user.id, user.username);
    res.json({
      token,
      user: { id: user.id, username: user.username, email: user.email },
    });
  } catch (err) {
    next(err);
  }
};
