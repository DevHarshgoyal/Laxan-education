# Frontend Structure Refactoring Plan

The current frontend structure places all components into a single `components` directory and all styles into a single `styles` directory. As the Laxan Dashboard grows, this flat structure can become difficult to maintain.

This plan proposes refactoring the React frontend to improve maintainability, module separation, and developer experience by colocating CSS files with their respective components and grouping components logically.

## User Review Required

> [!IMPORTANT]
> **Refactoring the Directory Structure**  
> We will be moving many files around. Please confirm if you are comfortable with colocating CSS files next to their components (e.g., `Header.jsx` and `Header.css` in the same folder) and breaking down the `components` directory into sub-directories.

## Open Questions

1. **Missing `registration.js` API file:** I noticed that `frontend/src/api/registration.js` appears to be missing or deleted from the disk, although `RegisterPage.jsx` is importing it. Should I recreate it based on the backend API, or do you already have it saved elsewhere?
2. **Feature-based vs. Type-based:** I am proposing grouping components by type (e.g., `layout`, `dashboard`). Would you prefer a strictly feature-based approach (e.g., `features/dashboard`, `features/registration`) instead?

## Proposed Changes

We will reorganize `frontend/src` into the following structure:

### `src/components/layout/`
Move shared layout components and their styles here:
- `Header.jsx` & `Header.css`
- `Footer.jsx` & `Footer.css`
- `TabBar.jsx` & `TabBar.css`

### `src/components/dashboard/`
Move dashboard-specific tabs and widgets here:
- `OverviewTab.jsx` 
- `AttendanceTab.jsx` & `AttendanceTab.css`
- `MarksTab.jsx` & `MarksTab.css`
- `SyllabusTab.jsx` & `SyllabusTab.css`
- `ProfileCard.jsx` & `ProfileCard.css`
- `FeeStatus.jsx` & `FeeStatus.css`
- `TeacherRemarks.jsx` & `TeacherRemarks.css`

### `src/pages/`
Keep the page-level components, but move their specific CSS files next to them.
- `DashboardPage.jsx`
- `RegisterPage.jsx` & `RegisterPage.css`

### `src/api/`
Ensure API functions are properly organized:
- Recreate/Verify `registration.js` (for POST `/api/register`)
- Create `student.js` (for GET `/api/students/:id`)

### `src/styles/`
Keep only global styles here:
- `index.css` (Global design tokens, variables, resets)
- `App.css` (App-level layout wrapper)

## Verification Plan

### Automated/Build Verification
- Run `npm run build` and `npm run dev` to ensure no import paths are broken.
- Verify ESLint passes without missing module errors.

### Manual Verification
- Test rendering of the `DashboardPage` to ensure all tabs (Overview, Attendance, Marks, Syllabus) load and style correctly.
- Test the `RegisterPage` to ensure forms and styles still work as expected.
