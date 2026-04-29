# Laxan Education Mobile Student Dashboard

This plan outlines the creation of the mobile student dashboard for "Laxan Education" based on your detailed UI requirements. We will build a responsive, single-page application using **React (via Vite)** and CSS.

## Proposed Changes

We will create a new React project in `C:\Users\Anshul computers\.gemini\antigravity\scratch\laxan-dashboard` using `create-vite`.

### Frontend Application

#### [NEW] `App.jsx` & Components
- Contains the main structure of the application.
- We will break down the UI into reusable React components:
  - `Header.jsx` (Sticky top bar)
  - `ProfileCard.jsx`
  - `TabBar.jsx` (Overview, Attendance, Marks, Syllabus)
  - Tab Contents:
    - `OverviewTab.jsx`
    - `AttendanceTab.jsx` (circular progress, stats, bar chart, calendar view)
    - `MarksTab.jsx` (table with color-coded percentages)
    - `SyllabusTab.jsx` (horizontal bars for subjects)
    - `FeeStatus.jsx`
    - `TeacherRemarks.jsx`
  - `Footer.jsx`

#### [NEW] `index.css` & `App.css`
- Core design system:
  - **Colors**: Dark Navy, Warm Cream/Off-white (`#F0EDE8`), Gold (`#C9A84C`), Green (`#3CC87E`).
  - **Typography**: Modern sans-serif font (e.g., Inter).
  - **Layout**: Mobile-first approach, using Flexbox and Grid.
  - **Component Styling**: 18px rounded corners for cards, subtle hover lift animations.
  - Custom CSS for circular progress, bar charts, and progress bars.

#### [NEW] `script.js`
- Logic for tab switching (Overview, Attendance, Marks, Syllabus).
- Optional: Dynamically rendering the 20-day attendance calendar and simple bar charts.

## Verification Plan

### Manual Verification
- We will start a local server to view the HTML page.
- We will visually inspect the layout against all the requested specifications (colors, fonts, header, profile, sections, etc.).
- We will test the tab interactions.
- We will generate a screenshot of the app running in a mobile-view port using the browser subagent to present the final design to you.

## User Review Required

Please review this plan. If you agree, I will proceed to build out the application in the specified scratch directory!
