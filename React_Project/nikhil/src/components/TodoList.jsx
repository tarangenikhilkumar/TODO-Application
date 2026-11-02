import TodoItem from "./TodoItem";

export default function TodoList({ todos, loading, ...handlers }) {
  if (loading) return <p className="info">⏳ Loading your todos...</p>;

  if (todos.length === 0)
    return (
      <div className="card empty">
        <span className="emoji">📭</span>
        <h3>No todos found</h3>
        <p>Add a new todo above or change your filters.</p>
      </div>
    );

  return (
    <ul className="todo-list">
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} {...handlers} />
      ))}
    </ul>
  );
}