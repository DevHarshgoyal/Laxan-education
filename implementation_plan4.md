# Backend Scalable Folder Structure Refactor

This plan outlines the steps to refactor the current `backend` directory into a scalable architecture, suitable for adding more features, routes, and controllers in the future.

## Open Questions
- Do you plan to add other features (like teacher login, admin panels) to this backend soon, or should we group all current endpoints under a general `dashboard` context?
- Is there any specific folder structure pattern you prefer (e.g., MVC-style, feature-based modules)? The proposed structure is a standard MVC-inspired (Model-View-Controller, minus the View) pattern commonly used in Express apps.

## Proposed Changes

We will reorganize the codebase into standard directories: `config`, `controllers`, `routes`, and `models`.

### 1. `config/` Directory
- Move database configuration here.
#### [NEW] `backend/config/db.js`
- Move existing `db.js` into this folder.
#### [DELETE] `backend/db.js`

### 2. `models/` Directory
- Move the database queries here.
#### [NEW] `backend/models/queries.js`
- Move existing `queries.js` into this folder.
#### [DELETE] `backend/queries.js`

### 3. `controllers/` Directory
- Create controllers to handle the business logic (request/response handling).
#### [NEW] `backend/controllers/dashboardController.js`
- Move the route handler functions from `server.js` into this file. It will use `models/queries.js` and `config/db.js`.

### 4. `routes/` Directory
- Define API endpoints and map them to controller functions.
#### [NEW] `backend/routes/dashboardRoutes.js`
- Define routes for `/api/profile`, `/api/fees`, etc., and map them to `dashboardController.js`.

### 5. Root Directory Updates
#### [MODIFY] `backend/server.js`
- Update to simply setup Express, mount the `dashboardRoutes`, and start the server. Remove all inline route handlers.

## Verification Plan

### Automated Tests
- N/A

### Manual Verification
- Start the server using `npm run dev` (or `node server.js`).
- Test all API endpoints (`/api/profile`, `/api/fees`, etc.) using a browser or `curl` to ensure they still return the correct JSON data.
- Ensure the React frontend still functions correctly and loads data from the newly structured backend.
