import { v4 as uuidv4 } from "uuid";

const normalize = (value) =>
  String(value ?? "")
    .trim()
    .toLowerCase();

const getMatchType = (left, right) => {
  const leftTeachesRightWants =
    normalize(left.teaches) === normalize(right.wants);
  const rightTeachesLeftWants =
    normalize(right.teaches) === normalize(left.wants);

  if (leftTeachesRightWants && rightTeachesLeftWants) {
    return "exact";
  }

  if (leftTeachesRightWants || rightTeachesLeftWants) {
    return "partial";
  }

  return null;
};

const sortPair = (firstId, secondId) =>
  firstId < secondId ? [firstId, secondId] : [secondId, firstId];

export const createMatchesForOffer = async (pool, offer) => {
  const [offers] = await pool.execute(
    `SELECT id, user_id, teaches, wants
		 FROM offers
		 WHERE is_active = 1 AND id <> ? AND user_id <> ?`,
    [offer.id, offer.user_id],
  );

  const createdMatches = [];

  for (const candidate of offers) {
    const matchType = getMatchType(offer, candidate);

    if (!matchType) {
      continue;
    }

    const [offerAId, offerBId] = sortPair(offer.id, candidate.id);
    const [existing] = await pool.execute(
      "SELECT id FROM matches WHERE offer_a_id = ? AND offer_b_id = ?",
      [offerAId, offerBId],
    );

    if (existing.length > 0) {
      continue;
    }

    const id = uuidv4();
    await pool.execute(
      `INSERT INTO matches (id, offer_a_id, offer_b_id, match_type, status)
			 VALUES (?, ?, ?, ?, 'pending')`,
      [id, offerAId, offerBId, matchType],
    );

    createdMatches.push({ id, offerAId, offerBId, matchType });
  }

  return createdMatches;
};

export const getMatchById = async (pool, matchId) => {
  const [rows] = await pool.execute(
    `SELECT m.id,
						m.offer_a_id,
						m.offer_b_id,
						m.match_type,
						m.status,
						m.created_at,
						a.user_id AS offer_a_user_id,
						b.user_id AS offer_b_user_id
		 FROM matches m
		 JOIN offers a ON a.id = m.offer_a_id
		 JOIN offers b ON b.id = m.offer_b_id
		 WHERE m.id = ?`,
    [matchId],
  );

  return rows[0] || null;
};

export const getMatchesForUser = async (pool, userId) => {
  const [rows] = await pool.execute(
    `SELECT m.id,
						m.match_type,
						m.status,
						m.created_at,
						a.id AS offer_a_id,
						a.teaches AS offer_a_teaches,
						a.wants AS offer_a_wants,
						a.level AS offer_a_level,
						a.user_id AS offer_a_user_id,
						ua.username AS offer_a_username,
						b.id AS offer_b_id,
						b.teaches AS offer_b_teaches,
						b.wants AS offer_b_wants,
						b.level AS offer_b_level,
						b.user_id AS offer_b_user_id,
						ub.username AS offer_b_username
		 FROM matches m
		 JOIN offers a ON a.id = m.offer_a_id
		 JOIN offers b ON b.id = m.offer_b_id
		 JOIN users ua ON ua.id = a.user_id
		 JOIN users ub ON ub.id = b.user_id
		 WHERE a.user_id = ? OR b.user_id = ?
		 ORDER BY m.created_at DESC`,
    [userId, userId],
  );

  return rows;
};
