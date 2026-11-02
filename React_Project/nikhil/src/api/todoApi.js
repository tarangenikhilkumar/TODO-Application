import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { "Content-Type": "application/json" },
});

// Turns any API/network error into a friendly message
export const getErrorMessage = (err) => {
  // Our own thrown errors (no HTTP response, but a custom message)
  if (!err.response && err.isCustom) return err.message;
  if (!err.response) return "Cannot reach the server. Please check that the API is running.";
  const data = err.response.data;
  if (data?.errors) return Object.values(data.errors).flat().join(" ");
  return data?.message || data?.title || "Something went wrong. Please try again.";
};

// Remove empty filters so they are not sent in the URL
const clean = (params) =>
  Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== "" && v != null && v !== "All")
  );

export const getTodos = async (params = {}) => {
  const data = (await api.get("/todos", { params: clean(params) })).data;

  // If the URL is wrong, the server may return HTML or an object instead of a list
  if (!Array.isArray(data)) {
    const error = new Error(
      "The API did not return a todo list. Check VITE_API_URL in your .env file."
    );
    error.isCustom = true;
    throw error;
  }
  return data;
};

export const createTodo = async (todo) => (await api.post("/todos", todo)).data;

export const updateTodo = async (id, todo) =>
  (await api.put(`/todos/${id}`, todo)).data;

export const deleteTodo = async (id) => api.delete(`/todos/${id}`);