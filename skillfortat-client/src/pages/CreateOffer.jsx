import { useNavigate } from "react-router-dom";
import OfferForm from "../components/offers/OfferForm";
import useMatchStore from "../store/matchStore";

export default function CreateOffer() {
  const navigate = useNavigate();
  const createOffer = useMatchStore((state) => state.createOffer);

  const handleSubmit = async (payload) => {
    await createOffer(payload);
    navigate("/dashboard");
  };

  return (
    <div className="page-stack narrow">
      <section className="section-heading">
        <h1>Publish a skill offer</h1>
        <p className="muted">
          Describe what you can teach and what you want to learn.
        </p>
      </section>

      <OfferForm onSubmit={handleSubmit} submitLabel="Create offer" />
    </div>
  );
}
