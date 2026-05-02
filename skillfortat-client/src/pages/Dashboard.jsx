import { useEffect } from "react";
import OfferCard from "../components/offers/OfferCard";
import OfferForm from "../components/offers/OfferForm";
import useAuthStore from "../store/authStore";
import useMatchStore from "../store/matchStore";

export default function Dashboard() {
  const user = useAuthStore((state) => state.user);
  const offers = useMatchStore((state) => state.offers);
  const myOffers = useMatchStore((state) => state.myOffers);
  const fetchOffers = useMatchStore((state) => state.fetchOffers);
  const fetchMyOffers = useMatchStore((state) => state.fetchMyOffers);
  const createOffer = useMatchStore((state) => state.createOffer);
  const deleteOffer = useMatchStore((state) => state.deleteOffer);

  useEffect(() => {
    fetchOffers();
    fetchMyOffers();
  }, [fetchMyOffers, fetchOffers]);

  return (
    <div className="page-stack">
      <section className="hero panel hero-panel">
        <div>
          <p className="eyebrow">Skill exchange dashboard</p>
          <h1>Welcome back, {user?.username || "builder"}</h1>
          <p className="muted">
            Publish a skill offer, scan the marketplace, and jump into active
            matches.
          </p>
        </div>

        <div className="stats-row">
          <div className="stat-card">
            <strong>{myOffers.length}</strong>
            <span>My offers</span>
          </div>
          <div className="stat-card">
            <strong>{offers.length}</strong>
            <span>Live offers</span>
          </div>
        </div>
      </section>

      <section>
        <div className="section-heading">
          <h2>Create a new offer</h2>
        </div>
        <OfferForm onSubmit={createOffer} />
      </section>

      <section>
        <div className="section-heading">
          <h2>My offers</h2>
        </div>
        <div className="grid cards-grid">
          {myOffers.map((offer) => (
            <OfferCard key={offer.id} offer={offer} onDelete={deleteOffer} />
          ))}
        </div>
      </section>

      <section>
        <div className="section-heading">
          <h2>Marketplace</h2>
        </div>
        <div className="grid cards-grid">
          {offers.map((offer) => (
            <OfferCard key={offer.id} offer={offer} />
          ))}
        </div>
      </section>
    </div>
  );
}
