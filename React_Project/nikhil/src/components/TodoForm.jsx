import { useEffect, useState } from "react";

const emptyForm = {
  title: "",
  description: "",
  priority: "Medium",
  category: "Work",
};

export default function TodoForm({ onSubmit, editingTodo, onCancel }) {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  useEffect(() => {
    setForm(editingTodo ? { ...editingTodo } : emptyForm);
    setError("");
  }, [editingTodo]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError("Title is required.");
      return;
    }
    const success = await onSubmit({ ...form, title: form.title.trim() });
    if (success) setForm(emptyForm);
  };

  return (
    <form className="card todo-form" onSubmit={handleSubmit}>
      <h2>{editingTodo ? "Edit Todo" : "Add New Todo"}</h2>

      <input
        name="title"
        placeholder="Title *"
        value={form.title}
        onChange={handleChange}
        maxLength={100}
      />
      {error && <p className="field-error">{error}</p>}

      <textarea
        name="description"
        placeholder="Description (optional)"
        value={form.description || ""}
        onChange={handleChange}
        rows={3}
      />

      <div className="row">
        <select name="priority" value={form.priority} onChange={handleChange}>
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>

        <select name="category" value={form.category} onChange={handleChange}>
          <option>Work</option>
          <option>Personal</option>
        </select>
      </div>

      <div className="row">
        <button type="submit" className="btn primary">
          {editingTodo ? "Update" : "Add Todo"}
        </button>
        {editingTodo && (
          <button type="button" className="btn" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}