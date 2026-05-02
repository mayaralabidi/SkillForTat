import { v4 as uuidv4 } from "uuid";

export const getMessagesForMatch = async (pool, matchId) => {
  const [rows] = await pool.execute(
    `SELECT m.id,
						m.match_id AS matchId,
						m.sender_id AS senderId,
						u.username AS senderUsername,
						m.body,
						m.sent_at AS sentAt
		 FROM messages m
		 JOIN users u ON u.id = m.sender_id
		 WHERE m.match_id = ?
		 ORDER BY m.sent_at ASC`,
    [matchId],
  );

  return rows;
};

export const createMessage = async (pool, { matchId, senderId, body }) => {
  const id = uuidv4();

  await pool.execute(
    "INSERT INTO messages (id, match_id, sender_id, body) VALUES (?, ?, ?, ?)",
    [id, matchId, senderId, body],
  );

  const [rows] = await pool.execute(
    `SELECT m.id,
						m.match_id AS matchId,
						m.sender_id AS senderId,
						u.username AS senderUsername,
						m.body,
						m.sent_at AS sentAt
		 FROM messages m
		 JOIN users u ON u.id = m.sender_id
		 WHERE m.id = ?`,
    [id],
  );

  return rows[0];
};
