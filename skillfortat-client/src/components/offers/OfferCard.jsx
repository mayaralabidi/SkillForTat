export default function OfferCard({ offer, onDelete }) {
  return (
    <article className="card offer-card">
      <div className="card-header">
        <div>
          <p className="eyebrow">{offer.level}</p>
          <h3>{offer.teaches}</h3>
        </div>
        <span
          className={`status-pill ${offer.isActive ? "status-live" : "status-muted"}`}
        >
          {offer.isActive ? "Active" : "Inactive"}
        </span>
      </div>

      <p className="muted">Wants to learn {offer.wants}</p>
      <p className="meta">By {offer.username}</p>

      {onDelete ? (
        <button
          type="button"
          className="button button-ghost danger"
          onClick={() => onDelete(offer.id)}
        >
          Archive
        </button>
      ) : null}
    </article>
  );
}
