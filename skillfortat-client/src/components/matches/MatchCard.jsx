import { Link } from "react-router-dom";

export default function MatchCard({ match, onAccept, onDecline }) {
  const partnerUsername =
    match.offer_a_user_id === match.currentUserId
      ? match.offer_b_username
      : match.offer_a_username;

  return (
    <article className="card match-card">
      <div className="card-header">
        <div>
          <p className="eyebrow">{match.match_type}</p>
          <h3>{partnerUsername}</h3>
        </div>
        <span className={`status-pill status-${match.status}`}>
          {match.status}
        </span>
      </div>

      <p className="muted">
        {match.offer_a_username} teaches {match.offer_a_teaches} and wants{" "}
        {match.offer_a_wants}.
      </p>
      <p className="muted">
        {match.offer_b_username} teaches {match.offer_b_teaches} and wants{" "}
        {match.offer_b_wants}.
      </p>

      <div className="button-row">
        <Link className="button button-primary" to={`/chat/${match.id}`}>
          Open chat
        </Link>
        <button
          type="button"
          className="button button-ghost"
          onClick={() => onAccept(match.id)}
        >
          Accept
        </button>
        <button
          type="button"
          className="button button-ghost danger"
          onClick={() => onDecline(match.id)}
        >
          Decline
        </button>
      </div>
    </article>
  );
}
