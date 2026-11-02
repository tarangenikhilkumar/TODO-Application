export default function TodoItem({ todo, onToggle, onEdit, onDelete }) {
  const date = todo.createdAt
    ? new Date(todo.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "";

  return (
    <li
      className={`card todo-item p-${todo.priority.toLowerCase()} ${
        todo.isCompleted ? "done" : ""
      }`}
    >
      <input
        type="checkbox"
        checked={todo.isCompleted}
        onChange={() => onToggle(todo)}
        title="Mark as completed"
      />

      <div className="todo-body">
        <h3>{todo.title}</h3>
        {todo.description && <p>{todo.description}</p>}
        <div className="badges">
          <span className={`badge ${todo.priority.toLowerCase()}`}>
            {todo.priority === "High" ? "🔴" : todo.priority === "Medium" ? "🟡" : "🟢"}{" "}
            {todo.priority}
          </span>
          <span className="badge category">
            {todo.category === "Work" ? "💼" : "🏠"} {todo.category}
          </span>
          {date && <span className="todo-date">📅 {date}</span>}
        </div>
      </div>

      <div className="actions">
        <button className="btn" onClick={() => onEdit(todo)}>✏️ Edit</button>
        <button className="btn danger" onClick={() => onDelete(todo.id)}>🗑️ Delete</button>
      </div>
    </li>
  );
}