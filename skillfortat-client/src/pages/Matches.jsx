import { useEffect } from "react";
import MatchList from "../components/matches/MatchList";
import useAuthStore from "../store/authStore";
import useMatchStore from "../store/matchStore";

export default function Matches() {
  const user = useAuthStore((state) => state.user);
  const matches = useMatchStore((state) => state.matches);
  const fetchMatches = useMatchStore((state) => state.fetchMatches);
  const acceptMatch = useMatchStore((state) => state.acceptMatch);
  const declineMatch = useMatchStore((state) => state.declineMatch);

  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

  return (
    <div className="page-stack">
      <section className="section-heading">
        <p className="eyebrow">Your matches</p>
        <h1>Review and open conversations</h1>
        <p className="muted">
          Accept a match to keep it active, or jump straight into chat.
        </p>
      </section>

      <MatchList
        matches={matches}
        currentUserId={user?.id}
        onAccept={acceptMatch}
        onDecline={declineMatch}
      />
    </div>
  );
}
