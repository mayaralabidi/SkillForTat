import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";

export default function Register() {
  const navigate = useNavigate();
  const register = useAuthStore((state) => state.register);
  const loading = useAuthStore((state) => state.loading);
  const error = useAuthStore((state) => state.error);
  const clearError = useAuthStore((state) => state.clearError);
  const [form, setForm] = useState({ username: "", email: "", password: "" });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await register(form);
    navigate("/dashboard", { replace: true });
  };

  return (
    <main className="auth-page">
      <section className="auth-card panel">
        <p className="eyebrow">Join the exchange</p>
        <h1>Create your account</h1>
        <p className="muted">
          Show what you can teach and discover what you want to learn next.
        </p>

        <form
          className="form-grid"
          onSubmit={handleSubmit}
          onFocus={clearError}
        >
          <input
            name="username"
            type="text"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
          />
          {error ? <p className="error-text">{error}</p> : null}
          <button
            type="submit"
            className="button button-primary"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="muted center-text">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </section>
    </main>
  );
}
