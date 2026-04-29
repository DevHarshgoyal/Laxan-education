# Make Laxan Dashboard Dynamic

This plan outlines the steps to separate the project into a frontend and a backend, and transition the currently static data into dynamic API calls.

## Goal
- Restructure the repository into two separate folders: `frontend/` and `backend/`.
- Set up a Node.js + Express backend to serve data.
- Update the React components to fetch data from the backend APIs.

## User Review Required
> [!WARNING]
> This restructuring will move your existing project files into a new `frontend` folder. 
> Since you currently have `npm run dev` running in the root folder, **this command will fail or crash** once the files are moved. You will need to restart the development servers in their respective folders after the changes are complete.

## Proposed Changes

### 1. Project Restructuring
I will move all the current frontend files into a new `frontend` directory.
- `src/`, `public/`, `index.html`, `package.json`, `vite.config.js`, etc. -> `frontend/`

### 2. Backend Setup (`backend/`)
I will initialize a new Node.js project in the `backend` folder and install `express` and `cors`.
#### [NEW] backend/package.json
#### [NEW] backend/server.js
This file will contain the Express server and the following endpoints:
- `GET /api/profile`: Returns student details and overall attendance %.
- `GET /api/fees`: Returns fee status (total, paid, pending).
- `GET /api/attendance`: Returns calendar days and monthly attendance stats.
- `GET /api/marks`: Returns the list of recent tests and marks.
- `GET /api/syllabus`: Returns subjects and their completion percentages.
- `GET /api/remarks`: Returns the teacher remarks.

### 3. Frontend Integration (`frontend/src/components/`)
I will update the components to use `useState` and `useEffect` to fetch data from `http://localhost:5000/api/...` instead of using hardcoded variables.

#### [MODIFY] frontend/src/components/TeacherRemarks.jsx
#### [MODIFY] frontend/src/components/SyllabusTab.jsx
#### [MODIFY] frontend/src/components/MarksTab.jsx
#### [MODIFY] frontend/src/components/AttendanceTab.jsx
#### [MODIFY] frontend/src/components/FeeStatus.jsx
#### [MODIFY] frontend/src/components/ProfileCard.jsx

## Verification Plan
1. Start the Node.js backend on port 5000: `cd backend && node server.js`
2. Start the Vite frontend on port 5173: `cd frontend && npm run dev`
3. Verify that the dashboard loads correctly and displays data fetched from the backend.
