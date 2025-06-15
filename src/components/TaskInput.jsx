import React, { useState } from "react";

const TaskInput = ({ onAddTask }) => {
  const [text, setText] = useState("");
  const [category, setCategory] = useState("personal");
  const [priority, setPriority] = useState("medium");
  const [error, setError] = useState("");

  const categories = [
    { value: "personal", label: "Personal" },
    { value: "work", label: "Work" },
    { value: "shopping", label: "Shopping" },
    { value: "health", label: "Health" },
    { value: "learning", label: "Learning" },
    { value: "other", label: "Other" },
  ];

  const priorities = [
    { value: "low", label: "Low Priority" },
    { value: "medium", label: "Medium Priority" },
    { value: "high", label: "High Priority" },
  ];

  const validateInput = (text) => {
    if (text.length < 3) {
      return "Task must be at least 3 characters long";
    }
    if (text.length > 100) {
      return "Task must be less than 100 characters long";
    }
    return "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmedText = text.trim();
    const validationError = validateInput(trimmedText);

    if (validationError) {
      setError(validationError);
      return;
    }

    onAddTask({
      text: trimmedText,
      category,
      priority,
    });

    // Reset form
    setText("");
    setError("");

    // Add animation class to the container
    const container = e.target.closest(".task-input-container");
    container.classList.add("task-added");
    setTimeout(() => container.classList.remove("task-added"), 600);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setText(value);

    // Clear error when user starts typing
    if (error && value.trim().length >= 3) {
      setError("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="task-input-container">
      <form onSubmit={handleSubmit} className="task-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="task-text">Task Description</label>
            <input
              id="task-text"
              type="text"
              value={text}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="What needs to be done?"
              className={`task-input ${error ? "error" : ""}`}
              maxLength="100"
              autoFocus
            />
            {error && <div className="error-message">{error}</div>}
            <div
              className="char-counter"
              style={{
                fontSize: "12px",
                color: "var(--text-secondary)",
                marginTop: "5px",
              }}
            >
              {text.length}/100 characters
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="task-category">Category</label>
            <select
              id="task-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="category-select"
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="task-priority">Priority</label>
            <select
              id="task-priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="priority-select"
            >
              {priorities.map((pri) => (
                <option key={pri.value} value={pri.value}>
                  {pri.label}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={text.trim().length < 3}
          >
            + Add Task
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskInput;
