# StudyTrack Pro — Next.js 

A Next.js rebuild of the StudyTrack Pro goal planner, restyled with a clean
black-and-white, card-based UI inspired by the TaskHub dashboard design —
white background, light-gray sidebar, soft-shadow cards, colored top accents
on stat cards, pill-style nav tabs, and solid black primary actions.



---

## Table of contents
- [Features](#features)
- [Getting started](#getting-started)
- [Project structure](#project-structure)
- [Views in detail](#views-in-detail)
- [Data model & persistence](#data-model--persistence)
- [Dark theme](#dark-theme)
- [Design tokens](#design-tokens)
- [Notes](#notes)

---

## Features

### 📅 Day view
- Add tasks with **name, category, hours, priority, and subtasks**
- Checkbox to mark a task done/not done, with live strikethrough
- Expandable subtask checklist per task, with its own progress count
- Edit modal to rename, re-categorize, change hours/priority, and add/remove subtasks
- Delete a task from the edit modal
- Filter tasks by **All / Pending / Done**
- Jump to any date via the date picker
- Live stat cards: tasks completed, hours logged vs target, subtasks completed, day completion %

### 🗓️ Week view
- 7-day card grid showing tasks done and hours logged per day
- Click any day card to jump straight into its Day view
- Prev / This week / Next navigation
- Bar chart comparing **hours logged vs target** across the week
- Weekly stat cards: tasks vs weekly goal, hours vs target, completion rate, average hours/day

### 🈸 Month view
- Full calendar grid for the month, each cell shaded by hours logged that day (heat-style)
- Click any day cell to jump into its Day view
- Prev / This month / Next navigation
- Line chart of the daily hours trend across the month
- Monthly stat cards: hours vs monthly goal, tasks completed, completion rate, average hours/day

### 📊 Analytics view
- All-time totals: hours logged, tasks completed
- **Current streak** and **best streak** (consecutive days with at least one completed task)
- 16-week **activity heatmap** (GitHub-style contribution grid)
- **Category breakdown** doughnut chart (hours by category, completed tasks only)
- Goals summary card: description, focus categories, and daily/weekly/monthly targets

### 🎯 Goals modal
- Set daily study hours goal, weekly task goal, and monthly hours goal
- Pick focus categories (Study, Revision, Practice, Research, Assignment)
- Optional free-text goal description (e.g. "Prepare for UPSC 2025")
- Goals feed directly into the progress bars/targets shown across all views

### 🧭 Sidebar
- Mini calendar with month navigation, a dot marker on days that have tasks, and a checkmark tint on fully completed days
- Per-day hour target stepper with a circular progress ring
- Quick stats panel: tasks done/total, hours logged, target, with a mini progress bar

### 💾 Data & feedback
- Everything **autosaves to `localStorage`** — no backend required
- **"Save & Download"** button exports the full app state as a timestamped JSON file
- Toast notifications confirm every add / edit / delete / complete / goal-save action

---

## Getting started

```bash
npm install
npm run dev
```

Then open **http://localhost:3000**.

To build for production:
```bash
npm run build
npm start
```

---

## Project structure

```
app/
  layout.tsx          # Root layout, wraps the app in AppDataProvider
  page.tsx            # Main page — view switcher, sidebar, modals, toasts
  globals.css         # Design tokens (CSS variables), base styles, animations

components/
  Topbar.tsx          # Logo, Day/Week/Month/Analytics tabs, Goals + Save&Download buttons
  Sidebar.tsx         # Mini calendar, hour target widget, quick stats
  StatCard.tsx        # Reusable metric card with accent bar + optional progress fill
  TaskItem.tsx        # Single task row: checkbox, tags, expandable subtasks
  AddTaskForm.tsx     # Inline form for creating a new task (with dynamic subtask rows)
  EditTaskModal.tsx   # Modal for editing/deleting an existing task
  GoalsModal.tsx      # Modal for setting daily/weekly/monthly goals
  Modal.tsx           # Generic modal shell used by the two modals above
  ProgressRing.tsx    # SVG circular progress indicator
  ToastContainer.tsx  # Renders active toast notifications

  views/
    DayView.tsx       # Daily planner
    WeekView.tsx      # Weekly overview + bar chart
    MonthView.tsx     # Monthly calendar + trend chart
    AnalyticsView.tsx # All-time stats, heatmap, streaks, category chart

lib/
  types.ts            # Task/Goals/Category/Priority types + label & color maps
  date.ts              # IST-aware date helpers (dateKey, week start, formatting)
  store.tsx            # AppDataProvider — context + localStorage persistence + all mutations
```

---

## Views in detail

| View | Route trigger | Key data shown |
|---|---|---|
| Day | Topbar tab "Day" (default) | Tasks for the selected date, hour target/logged, subtask progress |
| Week | Topbar tab "Week" | 7 days from the week of the selected date, hours bar chart |
| Month | Topbar tab "Month" | Full month grid, daily hours line chart |
| Analytics | Topbar tab "Analytics" | Lifetime totals, streaks, heatmap, category doughnut |

Navigation between views is purely client-side state (`useState<ViewKey>` in `app/page.tsx`) — no routing/URL changes, matching the single-page feel of the original app.

---

## Data model & persistence

All app state lives in one object (see `lib/types.ts`):

```ts
interface AppData {
  tasks: Record<string, Task[]>;       // keyed by "YYYY-MM-DD"
  hourTargets: Record<string, number>; // per-day target override
  goals: Goals;                        // dailyHours, weeklyTasks, monthlyHours, categories, description
}
```

- `lib/store.tsx` exposes this via React Context (`useAppData()`), with helper methods like `addTask`, `toggleTask`, `editTask`, `deleteTask`, `getLoggedHours`, `saveGoals`, etc.
- State is persisted to `localStorage` under the key **`studytrack_data`** on every change.
- **"Save & Download"** serializes the same object to a `StudyTrack_YYYY-MM-DD.json` file via a blob download — useful as a manual backup or for transferring data between browsers.

---

## Dark theme

Dark mode is implemented purely with CSS variables in `app/globals.css`. The `:root` block defines the light palette; a `.dark` class overrides the same variable names for dark surfaces, text, and accent colors (with a higher-contrast shadow scale). Every component reads colors via `var(--bg)`, `var(--surface)`, `var(--ink)`, etc., so toggling the `dark` class on `<html>` or `<body>` re-themes the whole app without touching component code.

To wire up a toggle:
```tsx
document.documentElement.classList.toggle('dark');
```
(Persist the preference in `localStorage` or `prefers-color-scheme` as desired.)

---

## Design tokens

Defined in `app/globals.css`:

- **Surfaces**: `--bg`, `--surface`, `--surface2`, `--surface3`, `--border`
- **Text**: `--ink`, `--ink-soft`, `--muted`, `--muted2`
- **Category accents**: `--accent-study`, `--accent-revision`, `--accent-practice`, `--accent-research`, `--accent-assignment`, `--accent-other`
- **Status**: `--success`, `--warning`, `--danger`
- **Shape/shadow**: `--radius`, `--radius-sm`, `--shadow-sm`, `--shadow`, `--shadow-lg`

Typography helper classes: `.font-display` (headings) and `.font-mono` (numbers/data).

---

## Notes
- Fonts currently use the system font stack (no Google Fonts network call), so the project builds fully offline. If you have internet access and want a more distinctive look with Space Grotesk / Inter / JetBrains Mono, reintroduce `next/font/google` in `app/layout.tsx` — the `.font-display` / `.font-mono` classes are already wired up to consume font variables once you add them back.
- Charts are built with `chart.js` + `react-chartjs-2` (bar, line, and doughnut charts across Week/Month/Analytics views).
- Dates are treated in IST (UTC+5:30) throughout, matching the original app's behavior.