import MatchCard from "./MatchCard";

export default function MatchList({
  matches,
  currentUserId,
  onAccept,
  onDecline,
}) {
  if (!matches.length) {
    return (
      <p className="empty-state">
        No matches yet. Publish a skill offer to start pairing.
      </p>
    );
  }

  return (
    <div className="grid cards-grid">
      {matches.map((match) => (
        <MatchCard
          key={match.id}
          match={{ ...match, currentUserId }}
          onAccept={onAccept}
          onDecline={onDecline}
        />
      ))}
    </div>
  );
}
