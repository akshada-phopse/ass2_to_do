# Brief Testing Guide

---
## Live Demo

[Click here to visit the app](https://ass2-to-do.vercel.app/)

---
## Quick Functionality Test (5 minutes)

---

### Basic Operations

- **Add a task:**  
  Type "Test task" → Select category → Click **Add Task**

- **Complete task:**  
  Click checkbox next to task

- **Delete task:**  
  Click delete button → Confirm deletion

---

### Core Features

- **Search:**  
  Type in search bar to filter tasks

- **Filter:**  
  Click **All / Pending / Completed** buttons

- **Sort:**  
  Use dropdown to sort by:
  - Date
  - Priority
  - Alphabetical

- **Dark Mode:**  
  Click moon/sun icon to toggle theme

---

### Validation Tests

- Try adding task with **less than 3 characters** (should show error)
- Try adding task with **more than 100 characters** (should show error)
- Add task with **exactly 3-100 characters** (should work)

---

### Data Persistence

- Add several tasks
- Refresh page (tasks should remain)
- Open new tab with same URL (tasks should sync)

---

### Mobile Test

- Open browser dev tools → Toggle device view
- Verify all features work on mobile layout

---

### Expected Results

- All tasks persist after page refresh
- Search filters tasks instantly
- Productivity score updates when completing tasks
- Dark mode saves preference
- Mobile layout is fully functional

---

**Test Duration:** ~5 minutes for full feature verification
