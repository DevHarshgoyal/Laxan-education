# Laxan Dashboard Dynamic Restructuring

The Laxan Dashboard has successfully been split into separate `frontend` and `backend` repositories! The application is now fully dynamic, with the frontend fetching its display data from the local Node.js Express server.

## What Was Changed

### Project Restructuring
- A new `frontend` directory was created, and all Vite/React code (including `src`, `public`, `index.html`, and `package.json`) was successfully migrated into it.
- A new `backend` directory was created to house the API service.

### Backend Implementation
- Initialized a Node.js project with `express` and `cors` in the `backend` folder.
- Created `server.js` which serves the following API endpoints:
  - `GET /api/profile`
  - `GET /api/fees`
  - `GET /api/attendance`
  - `GET /api/marks`
  - `GET /api/syllabus`
  - `GET /api/remarks`
- The static data that previously lived inside the React components was migrated to this Express backend.

### Frontend Integration
Updated the following React components to use `useState` and `useEffect` hooks, allowing them to dynamically fetch their data from the `http://localhost:5000` API:
- `TeacherRemarks.jsx`
- `SyllabusTab.jsx`
- `MarksTab.jsx`
- `AttendanceTab.jsx`
- `FeeStatus.jsx`
- `ProfileCard.jsx`

> [!WARNING]
> Because the project structure has changed, the development server you were running in the root folder will no longer work. You will need to stop that terminal command and restart your development environments.

## How to Run the App

Open two separate terminals in the project root:

**Terminal 1 (Backend Server):**
```bash
cd backend
node server.js
```
*(This starts the API on port 5000)*

**Terminal 2 (Frontend App):**
```bash
cd frontend
npm run dev -- --port 5173
```
*(This starts the React dashboard on port 5173)*
