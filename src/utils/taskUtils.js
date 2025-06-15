// Utility functions for task management

// Filter tasks based on search term and status
export const filterTasks = (tasks, searchTerm, statusFilter) => {
  return tasks.filter((task) => {
    // Filter by search term
    const matchesSearch =
      task.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.category.toLowerCase().includes(searchTerm.toLowerCase());

    // Filter by status
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "completed" && task.completed) ||
      (statusFilter === "pending" && !task.completed);

    return matchesSearch && matchesStatus;
  });
};

// Sort tasks based on different criteria
export const sortTasks = (tasks, sortBy) => {
  const sortedTasks = [...tasks];

  switch (sortBy) {
    case "date":
      return sortedTasks.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

    case "priority":
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return sortedTasks.sort((a, b) => {
        const priorityDiff =
          priorityOrder[b.priority] - priorityOrder[a.priority];
        if (priorityDiff !== 0) return priorityDiff;
        // If same priority, sort by date (newest first)
        return new Date(b.createdAt) - new Date(a.createdAt);
      });

    case "alphabetical":
      return sortedTasks.sort((a, b) => a.text.localeCompare(b.text));

    case "category":
      return sortedTasks.sort((a, b) => {
        const categoryDiff = a.category.localeCompare(b.category);
        if (categoryDiff !== 0) return categoryDiff;
        // If same category, sort by date (newest first)
        return new Date(b.createdAt) - new Date(a.createdAt);
      });

    default:
      return sortedTasks;
  }
};

// Calculate productivity score based on various factors
export const calculateProductivityScore = (tasks) => {
  if (tasks.length === 0) return 0;

  const completedTasks = tasks.filter((task) => task.completed);
  const totalTasks = tasks.length;

  // Base completion rate (0-60 points)
  const completionRate = (completedTasks.length / totalTasks) * 60;

  // Priority bonus (0-20 points)
  const highPriorityCompleted = completedTasks.filter(
    (task) => task.priority === "high"
  ).length;
  const highPriorityTotal = tasks.filter(
    (task) => task.priority === "high"
  ).length;
  const priorityBonus =
    highPriorityTotal > 0
      ? (highPriorityCompleted / highPriorityTotal) * 20
      : 10;

  // Recent activity bonus (0-20 points)
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const recentCompletions = completedTasks.filter((task) => {
    const completedDate = new Date(task.completedAt || task.createdAt);
    return completedDate >= yesterday;
  });

  const recentActivityBonus = Math.min(
    (recentCompletions.length / Math.max(completedTasks.length, 1)) * 20,
    20
  );

  const totalScore = Math.round(
    completionRate + priorityBonus + recentActivityBonus
  );
  return Math.min(totalScore, 100);
};

// Get task statistics
export const getTaskStatistics = (tasks) => {
  const completed = tasks.filter((task) => task.completed);
  const pending = tasks.filter((task) => !task.completed);

  const byCategory = tasks.reduce((acc, task) => {
    acc[task.category] = (acc[task.category] || 0) + 1;
    return acc;
  }, {});

  const byPriority = tasks.reduce((acc, task) => {
    acc[task.priority] = (acc[task.priority] || 0) + 1;
    return acc;
  }, {});

  const today = new Date().toDateString();
  const completedToday = completed.filter(
    (task) =>
      new Date(task.completedAt || task.createdAt).toDateString() === today
  );

  return {
    total: tasks.length,
    completed: completed.length,
    pending: pending.length,
    completedToday: completedToday.length,
    byCategory,
    byPriority,
    completionRate:
      tasks.length > 0
        ? Math.round((completed.length / tasks.length) * 100)
        : 0,
  };
};

// Validate task input
export const validateTask = (text, category, priority) => {
  const errors = [];

  if (!text || text.trim().length < 3) {
    errors.push("Task description must be at least 3 characters long");
  }

  if (text && text.trim().length > 100) {
    errors.push("Task description must be less than 100 characters long");
  }

  const validCategories = [
    "personal",
    "work",
    "shopping",
    "health",
    "learning",
    "other",
  ];
  if (!validCategories.includes(category)) {
    errors.push("Invalid category selected");
  }

  const validPriorities = ["low", "medium", "high"];
  if (!validPriorities.includes(priority)) {
    errors.push("Invalid priority selected");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Format date for display
export const formatDate = (dateString) => {
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

// Export/Import functionality
export const exportTasks = (tasks) => {
  const dataStr = JSON.stringify(tasks, null, 2);
  const dataUri =
    "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

  const exportFileDefaultName = `tasks-backup-${
    new Date().toISOString().split("T")[0]
  }.json`;

  const linkElement = document.createElement("a");
  linkElement.setAttribute("href", dataUri);
  linkElement.setAttribute("download", exportFileDefaultName);
  linkElement.click();
};

export const importTasks = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const tasks = JSON.parse(e.target.result);
        // Validate the imported data structure
        if (
          Array.isArray(tasks) &&
          tasks.every(
            (task) =>
              task.hasOwnProperty("id") &&
              task.hasOwnProperty("text") &&
              task.hasOwnProperty("completed")
          )
        ) {
          resolve(tasks);
        } else {
          reject(new Error("Invalid task file format"));
        }
      } catch (error) {
        reject(new Error("Failed to parse task file"));
      }
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsText(file);
  });
};
