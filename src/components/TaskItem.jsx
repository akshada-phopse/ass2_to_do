import React from "react";

const TaskItem = ({ task, onToggle, onDelete }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return "Today";
    } else if (diffDays === 2) {
      return "Yesterday";
    } else if (diffDays <= 7) {
      return `${diffDays - 1} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };
  const getPriorityColor = (priority) => {
    const colorMap = {
      high: "priority-high",
      medium: "priority-medium",
      low: "priority-low",
    };
    return colorMap[priority] || "priority-medium";
  };

  const handleToggle = () => {
    onToggle(task.id);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      onDelete(task.id);
    }
  };

  return (
    <div className={`task-item ${task.completed ? "completed" : ""}`}>
      <input
        type="checkbox"
        checked={task.completed}
        onChange={handleToggle}
        className="task-checkbox"
        aria-label={`Mark "${task.text}" as ${
          task.completed ? "incomplete" : "complete"
        }`}
      />

      <div className="task-content">
        <div className="task-main">
          <span className="task-text">{task.text}</span>

          <span className="task-category">{task.category}</span>

          <span className={`task-priority ${getPriorityColor(task.priority)}`}>
            {task.priority.toUpperCase()}
          </span>
        </div>

        <div className="task-meta">
          <span>Created: {formatDate(task.createdAt)}</span>
          {task.completed && task.completedAt && (
            <span>Completed: {formatDate(task.completedAt)}</span>
          )}
        </div>
      </div>

      <div className="task-actions">
        <button
          onClick={handleDelete}
          className="btn-delete"
          aria-label={`Delete task "${task.text}"`}
          title="Delete task"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskItem;
