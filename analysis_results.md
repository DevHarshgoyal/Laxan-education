# Laxan Dashboard Analysis

The **Laxan Education Dashboard** is a mobile-first web application designed to serve as a student portal. It is built with a modern, dynamic UI focused on a specific aesthetic (dark navy and warm cream color palette with gold and green accents).

## Technical Stack
- **Framework**: React 19 via Vite
- **Styling**: Vanilla CSS. The project intentionally uses modular `.css` files for each component to maintain customizability and strict adherence to the design system (e.g., consistent 18px border-radius, complex gradients, glassmorphism).
- **Tooling**: ESLint for code quality.

## Architecture & Structure
The project follows a component-driven architecture. The main application state is managed in `App.jsx`, which handles the tab navigation state.

### Key Components

#### Core Layout
- **`Header.jsx`**: The sticky top navigation/branding area.
- **`ProfileCard.jsx`**: Displays the student's vital information and likely uses the warm cream and gold accents.
- **`TabBar.jsx`**: Controls navigation between the different sections of the dashboard.
- **`Footer.jsx`**: Bottom branding or secondary links.

#### Tab Content Views
The dashboard features four primary tab views:

1. **Overview Tab (`OverviewTab.jsx`)**
   - **`FeeStatus.jsx`**: Tracks fee payments and due dates.
   - **`TeacherRemarks.jsx`**: Displays comments or feedback from instructors.
2. **Attendance Tab (`AttendanceTab.jsx`)**
   - Shows interactive attendance tracking and statistics.
3. **Marks Tab (`MarksTab.jsx`)**
   - Displays student grades and performance metrics.
4. **Syllabus Tab (`SyllabusTab.jsx`)**
   - Outlines the course curriculum and progress.

## UI/UX Approach
- **Mobile-First**: The application is tailored for a mobile viewport, typical for student dashboards.
- **Component-Specific Styling**: Almost every component (e.g., `TabBar`, `ProfileCard`, `FeeStatus`) has its own dedicated `.css` file ensuring encapsulated styles and localized animations.
- **Animations**: The use of `.fade-in` classes and other CSS animations are present to provide a smooth, premium feel as requested in the initial project setup.

## Current State
The project is fully initialized and the foundational structure (components, routing logic, and CSS files) is in place and currently running on the local dev server.
