import { useState } from "react";

const initialState = {
  teaches: "",
  wants: "",
  level: "beginner",
};

export default function OfferForm({ onSubmit, submitLabel = "Publish Offer" }) {
  const [form, setForm] = useState(initialState);
  const [saving, setSaving] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);

    try {
      await onSubmit(form);
      setForm(initialState);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="panel form-grid" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="teaches">I can teach</label>
        <input
          id="teaches"
          name="teaches"
          value={form.teaches}
          onChange={handleChange}
          placeholder="JavaScript, design, editing..."
        />
      </div>

      <div>
        <label htmlFor="wants">I want to learn</label>
        <input
          id="wants"
          name="wants"
          value={form.wants}
          onChange={handleChange}
          placeholder="React, copywriting, guitar..."
        />
      </div>

      <div>
        <label htmlFor="level">Skill level</label>
        <select
          id="level"
          name="level"
          value={form.level}
          onChange={handleChange}
        >
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>

      <button type="submit" className="button button-primary" disabled={saving}>
        {saving ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}
