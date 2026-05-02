import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";

export default function Login() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const loading = useAuthStore((state) => state.loading);
  const error = useAuthStore((state) => state.error);
  const clearError = useAuthStore((state) => state.clearError);
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await login(form);
    navigate("/dashboard", { replace: true });
  };

  return (
    <main className="auth-page">
      <section className="auth-card panel">
        <p className="eyebrow">Welcome back</p>
        <h1>Sign in to SkillForTat</h1>
        <p className="muted">
          Trade skills, track matches, and keep the conversation moving.
        </p>

        <form
          className="form-grid"
          onSubmit={handleSubmit}
          onFocus={clearError}
        >
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
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="muted center-text">
          Need an account? <Link to="/register">Create one</Link>
        </p>
      </section>
    </main>
  );
}
