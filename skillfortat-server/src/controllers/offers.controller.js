import { validationResult } from "express-validator";
import { v4 as uuidv4 } from "uuid";
import pool from "../config/db.js";
import { createMatchesForOffer } from "../services/matching.service.js";

const buildOfferSelect = () => `
	SELECT o.id,
         o.user_id,
         o.user_id AS userId,
				 u.username,
				 o.teaches,
				 o.wants,
				 o.level,
				 o.is_active AS isActive,
				 o.created_at AS createdAt
	FROM offers o
	JOIN users u ON u.id = o.user_id
`;

export const parseOfferBody = (body) => {
  const payload = {};

  if (body.teaches !== undefined && typeof body.teaches === "string") {
    payload.teaches = body.teaches.trim();
  }

  if (body.wants !== undefined && typeof body.wants === "string") {
    payload.wants = body.wants.trim();
  }

  if (body.level !== undefined && typeof body.level === "string") {
    payload.level = body.level.trim();
  }

  if (body.is_active !== undefined) {
    payload.is_active =
      body.is_active === true ||
      body.is_active === "true" ||
      body.is_active === 1 ||
      body.is_active === "1";
  }

  return payload;
};

export const getOffers = async (req, res, next) => {
  try {
    const [rows] = await pool.execute(
      `${buildOfferSelect()} WHERE o.is_active = 1 ORDER BY o.created_at DESC`,
    );

    res.json(rows);
  } catch (error) {
    next(error);
  }
};

export const getMyOffers = async (req, res, next) => {
  try {
    const [rows] = await pool.execute(
      `${buildOfferSelect()} WHERE o.user_id = ? ORDER BY o.created_at DESC`,
      [req.user.id],
    );

    res.json(rows);
  } catch (error) {
    next(error);
  }
};

export const createOffer = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { teaches, wants, level } = req.body;
    const id = uuidv4();

    console.log("[OFFER] Creating new offer");

    await pool.execute(
      `INSERT INTO offers (id, user_id, teaches, wants, level)
       VALUES (?, ?, ?, ?, ?)`,
      [id, req.user.id, teaches.trim(), wants.trim(), level],
    );

    const [rows] = await pool.execute(
      `${buildOfferSelect()} WHERE o.id = ?`,
      [id],
    );

    const offer = rows[0];

    console.log("[OFFER] Offer inserted successfully");

    const matches = await createMatchesForOffer(pool, offer);
    console.log(`[OFFER] Created ${matches.length} matches`);

    res.status(201).json({ offer });
  } catch (error) {
    next(error);
  }
};

export const updateOffer = async (req, res, next) => {
  try {
    const payload = parseOfferBody(req.body);
    const fields = Object.keys(payload);

    if (fields.length === 0) {
      return res.status(400).json({ message: "No changes provided" });
    }

    console.log("[OFFER] Updating offer");

    const [existingRows] = await pool.execute(
      "SELECT id FROM offers WHERE id = ? AND user_id = ?",
      [req.params.id, req.user.id],
    );

    if (existingRows.length === 0) {
      return res.status(404).json({ message: "Offer not found" });
    }

    const assignments = fields.map((field) => `${field} = ?`).join(", ");
    const values = fields.map((field) => payload[field]);

    await pool.execute(
      `UPDATE offers SET ${assignments} WHERE id = ? AND user_id = ?`,
      [...values, req.params.id, req.user.id],
    );

    const [rows] = await pool.execute(
      `${buildOfferSelect()} WHERE o.id = ?`,
      [req.params.id],
    );

    const offer = rows[0];

    if (offer?.isActive) {
      const matches = await createMatchesForOffer(pool, offer);
      console.log(`[OFFER] Updated offer created ${matches.length} matches`);
    }

    res.json(offer);
  } catch (error) {
    next(error);
  }
};

export const deleteOffer = async (req, res, next) => {
  try {
    const [result] = await pool.execute(
      "UPDATE offers SET is_active = 0 WHERE id = ? AND user_id = ?",
      [req.params.id, req.user.id],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Offer not found" });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};