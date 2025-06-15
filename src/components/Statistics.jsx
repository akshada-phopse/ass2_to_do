import React from "react";

const Statistics = ({ stats, dailyGoal, setDailyGoal, onClose }) => {
  const handleGoalChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= 50) {
      setDailyGoal(value);
    }
  };

  const getProductivityLevel = (score) => {
    if (score >= 80) return { level: "Excellent", color: "#48bb78" };
    if (score >= 60) return { level: "Good", color: "#ed8936" };
    if (score >= 40) return { level: "Average", color: "#667eea" };
    return { level: "Getting Started", color: "#a0aec0" };
  };

  const productivityInfo = getProductivityLevel(stats.productivityScore);

  return (
    <div className="statistics">
      <div className="stats-header">
        <h3>Productivity Dashboard</h3>
        <button
          onClick={onClose}
          className="btn-icon"
          aria-label="Close statistics"
        >
          ✕
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Total Tasks</div>
        </div>

        <div className="stat-card">
          <div className="stat-value" style={{ color: "#48bb78" }}>
            {stats.completed}
          </div>
          <div className="stat-label">Completed</div>
        </div>

        <div className="stat-card">
          <div className="stat-value" style={{ color: "#ed8936" }}>
            {stats.pending}
          </div>
          <div className="stat-label">Pending</div>
        </div>

        <div className="stat-card">
          <div className="stat-value" style={{ color: "#667eea" }}>
            {stats.completedToday}
          </div>
          <div className="stat-label">Completed Today</div>
        </div>
      </div>

      <div className="productivity-section" style={{ marginBottom: "25px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "15px",
          }}
        >
          <h4>Productivity Score</h4>
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "1.2rem",
              color: productivityInfo.color,
              fontWeight: "bold",
            }}
          >
            {productivityInfo.emoji} {stats.productivityScore}% -{" "}
            {productivityInfo.level}
          </span>
        </div>

        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width: `${stats.productivityScore}%`,
              background: `linear-gradient(90deg, ${productivityInfo.color}, ${productivityInfo.color}dd)`,
            }}
          ></div>
        </div>
      </div>

      <div className="progress-section">
        <div className="progress-header">
          <h4>Daily Goal Progress</h4>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <label htmlFor="daily-goal" style={{ fontSize: "14px" }}>
              Goal:
            </label>
            <input
              id="daily-goal"
              type="number"
              value={dailyGoal}
              onChange={handleGoalChange}
              min="1"
              max="50"
              style={{
                width: "60px",
                padding: "4px 8px",
                border: "1px solid var(--border-color)",
                borderRadius: "4px",
                background: "var(--bg-primary)",
                color: "var(--text-primary)",
                fontSize: "14px",
              }}
            />
            <span style={{ fontSize: "14px", color: "var(--text-secondary)" }}>
              {stats.completedToday}/{dailyGoal}
            </span>
          </div>
        </div>

        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${Math.min(stats.dailyProgress, 100)}%` }}
          ></div>
        </div>

        <div
          style={{
            textAlign: "center",
            marginTop: "10px",
            fontSize: "14px",
            color: "var(--text-secondary)",
          }}
        >
          {stats.dailyProgress >= 100
            ? "🎉 Daily goal achieved! Great job!"
            : `${Math.round(stats.dailyProgress)}% of daily goal completed`}
        </div>
      </div>

      {stats.total > 0 && (
        <div
          style={{
            marginTop: "20px",
            padding: "15px",
            background: "var(--bg-primary)",
            borderRadius: "8px",
            border: "1px solid var(--border-color)",
          }}
        >
          <h4 style={{ marginBottom: "10px" }}>Quick Stats</h4>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
              gap: "10px",
              fontSize: "14px",
            }}
          >
            <div>
              <strong>Completion Rate:</strong>{" "}
              {Math.round((stats.completed / stats.total) * 100)}%
            </div>
            <div>
              <strong>Tasks Left:</strong> {stats.pending}
            </div>
            <div>
              <strong>Today's Progress:</strong> {stats.completedToday} tasks
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Statistics;
