import React, { useState, useEffect, useMemo } from "react";
import TaskInput from "./components/TaskInput";
import TaskItem from "./components/TaskItem";
import Statistics from "./components/Statistics";
import { useLocalStorage } from "./hooks/useLocalStorage";
import "./App.css"; // Import your main CSS file
import {
  filterTasks,
  sortTasks,
  calculateProductivityScore,
} from "./utils/taskUtils";

function App() {
  const [tasks, setTasks] = useLocalStorage("tasks", []);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [darkMode, setDarkMode] = useLocalStorage("darkMode", false);
  const [focusMode, setFocusMode] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [dailyGoal, setDailyGoal] = useLocalStorage("dailyGoal", 5);

  // Apply dark mode theme
  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      darkMode ? "dark" : "light"
    );
  }, [darkMode]);

  // Filter and sort tasks
  const filteredAndSortedTasks = useMemo(() => {
    let filtered = filterTasks(tasks, searchTerm, statusFilter);
    return sortTasks(filtered, sortBy);
  }, [tasks, searchTerm, statusFilter, sortBy]);

  // Calculate statistics
  const stats = useMemo(() => {
    const completedTasks = tasks.filter((task) => task.completed);
    const pendingTasks = tasks.filter((task) => !task.completed);
    const completedToday = completedTasks.filter((task) => {
      const today = new Date().toDateString();
      return (
        new Date(task.completedAt || task.createdAt).toDateString() === today
      );
    });

    return {
      total: tasks.length,
      completed: completedTasks.length,
      pending: pendingTasks.length,
      completedToday: completedToday.length,
      productivityScore: calculateProductivityScore(tasks),
      dailyProgress: Math.min((completedToday.length / dailyGoal) * 100, 100),
    };
  }, [tasks, dailyGoal]);

  const addTask = (taskData) => {
    const newTask = {
      id: Date.now().toString(),
      text: taskData.text,
      category: taskData.category,
      priority: taskData.priority,
      completed: false,
      createdAt: new Date().toISOString(),
      completedAt: null,
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const toggleTask = (id) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? {
              ...task,
              completed: !task.completed,
              completedAt: !task.completed ? new Date().toISOString() : null,
            }
          : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const clearCompleted = () => {
    setTasks((prev) => prev.filter((task) => !task.completed));
  };

  return (
    <div className={`app ${focusMode ? "focus-mode" : ""}`}>
      <header className="header">
        <h1>TO DO</h1>
        <p>Boost your productivity with smart task management</p>
      </header>

      <div className="controls">
        <div className="controls-left">
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Tasks</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="date">Sort by Date</option>
            <option value="priority">Sort by Priority</option>
            <option value="alphabetical">Sort A-Z</option>
            <option value="category">Sort by Category</option>
          </select>
        </div>

        <div className="controls-right">
          <button
            onClick={() => setShowStats(!showStats)}
            className="btn btn-secondary"
          >
            Statistics
          </button>

          <button
            onClick={() => setFocusMode(!focusMode)}
            className="btn btn-secondary"
          >
            Focus
          </button>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="btn-icon"
            title="Toggle dark mode"
          >
            {darkMode ? "☀️" : "🌙"}
          </button>

          {stats.completed > 0 && (
            <button onClick={clearCompleted} className="btn btn-secondary">
              Clear Completed
            </button>
          )}
        </div>
      </div>

      {showStats && (
        <Statistics
          stats={stats}
          dailyGoal={dailyGoal}
          setDailyGoal={setDailyGoal}
          onClose={() => setShowStats(false)}
        />
      )}

      <TaskInput onAddTask={addTask} />

      <div className="task-list">
        <div className="task-list-header">
          <h3>
            Tasks ({filteredAndSortedTasks.length})
            {searchTerm && ` - "${searchTerm}"`}
            {statusFilter !== "all" && ` - ${statusFilter}`}
          </h3>
        </div>

        <div className="task-list-content">
          {filteredAndSortedTasks.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">?</div>
              <h3>
                {tasks.length === 0
                  ? "No tasks yet!"
                  : "No tasks match your current filters"}
              </h3>
              <p>
                {tasks.length === 0
                  ? "Add your first task to get started"
                  : "Try adjusting your search or filters"}
              </p>
            </div>
          ) : (
            filteredAndSortedTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={toggleTask}
                onDelete={deleteTask}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
