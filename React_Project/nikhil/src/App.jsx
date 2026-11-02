import { useCallback, useEffect, useState } from "react";
import "./App.css";
import {
  getTodos, createTodo, updateTodo, deleteTodo, getErrorMessage,
} from "./api/todoApi";
import useDebounce from "./hooks/useDebounce";
import TodoForm from "./components/TodoForm";
import FilterBar from "./components/FilterBar";
import TodoList from "./components/TodoList";

export default function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingTodo, setEditingTodo] = useState(null);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [priority, setPriority] = useState("All");
  const debouncedSearch = useDebounce(search);

  // Stats for the header cards and progress bar
  const total = todos.length;
  const completed = todos.filter((t) => t.isCompleted).length;
  const pending = total - completed;
  const percent = total ? Math.round((completed / total) * 100) : 0;

  const loadTodos = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getTodos({ search: debouncedSearch, category, priority });
      setTodos(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, category, priority]);

  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  // Returns true on success so the form knows whether to reset
  const handleSubmit = async (formData) => {
    try {
      setError("");
      if (editingTodo) {
        await updateTodo(editingTodo.id, { ...editingTodo, ...formData });
        setEditingTodo(null);
      } else {
        await createTodo({ ...formData, isCompleted: false });
      }
      await loadTodos();
      return true;
    } catch (err) {
      setError(getErrorMessage(err));
      return false;
    }
  };

  const handleToggle = async (todo) => {
    try {
      setError("");
      await updateTodo(todo.id, { ...todo, isCompleted: !todo.isCompleted });
      await loadTodos();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this todo?")) return;
    try {
      setError("");
      await deleteTodo(id);
      if (editingTodo?.id === id) setEditingTodo(null);
      await loadTodos();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <div className="container">
      <header className="app-header">
        <h1>📝 Todo Application</h1>
        <p>Stay organized. Get things done.</p>
      </header>

      <div className="stats">
        <div className="stat"><strong>{total}</strong><span>Total</span></div>
        <div className="stat"><strong>{pending}</strong><span>Pending</span></div>
        <div className="stat"><strong>{completed}</strong><span>Completed</span></div>
      </div>
      <div className="progress">
        <div className="progress-bar" style={{ width: `${percent}%` }} />
      </div>

      {error && (
        <div className="error-banner">
          {error}
          <button onClick={() => setError("")}>✕</button>
        </div>
      )}

      <TodoForm
        onSubmit={handleSubmit}
        editingTodo={editingTodo}
        onCancel={() => setEditingTodo(null)}
      />

      <FilterBar
        search={search} onSearch={setSearch}
        category={category} onCategory={setCategory}
        priority={priority} onPriority={setPriority}
      />

      <TodoList
        todos={todos}
        loading={loading}
        onToggle={handleToggle}
        onEdit={setEditingTodo}
        onDelete={handleDelete}
      />
    </div>
  );
}