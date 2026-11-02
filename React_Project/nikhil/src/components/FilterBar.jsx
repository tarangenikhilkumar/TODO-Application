export default function FilterBar({
  search, onSearch,
  category, onCategory,
  priority, onPriority,
}) {
  return (
    <div className="card filter-bar">
      <input
        type="text"
        placeholder="🔍 Search todos..."
        value={search}
        onChange={(e) => onSearch(e.target.value)}
      />

      <div className="row">
        {["All", "Work", "Personal"].map((c) => (
          <button
            key={c}
            className={`btn ${category === c ? "primary" : ""}`}
            onClick={() => onCategory(c)}
          >
            {c === "All" ? "View All" : `View ${c}`}
          </button>
        ))}

        <select value={priority} onChange={(e) => onPriority(e.target.value)}>
          <option value="All">All Priorities</option>
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>
      </div>
    </div>
  );
}