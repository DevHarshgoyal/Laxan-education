# Hosting Laxan Dashboard on Hostinger (Business Plan)

This plan outlines the steps to deploy both the Node.js backend and the React frontend of the Laxan Dashboard onto Hostinger's Shared Web Hosting Business Plan, and how to create the MySQL database there. Hostinger's Business Plan includes support for Node.js applications, making it possible to host both your API and static frontend.

## User Review Required

> [!IMPORTANT]
> **Node.js Support Check**  
> While Hostinger's newer Business Web Hosting plans include Node.js support natively through hPanel, you should log into your hPanel account to verify that you see the "Node.js" section under the "Advanced" menu for your website. 
> 
> **Database Credentials**  
> You will be managing the creation of the MySQL database in hPanel. The credentials generated (Host, DB Name, Username, Password) will be needed to configure the backend connection string.

## Open Questions

- What domain or subdomain will you be using for the frontend and backend? (e.g., `dashboard.yourdomain.com` for the React app and `api.yourdomain.com` for the Node.js backend).
- Would you like the backend code structured as an independent sub-directory or do you plan to connect it to a GitHub repository for automatic deployment?

## Proposed Deployment Strategy

Hostinger allows for separated frontend and backend deployment on the same plan. The most efficient way is:
1. **Frontend:** Deployed as static files (`index.html`, `assets/`) directly to a main domain (`yourdomain.com`) or subdomain.
2. **Backend:** Configured as a Node.js Application within hPanel, typically on a subdomain (`api.yourdomain.com`) or a subdirectory (`yourdomain.com/api`).
3. **Database:** Created via Hostinger's MySQL Databases tool.

---

### Step 1: Create the MySQL Database on Hostinger

1. Log into your **Hostinger hPanel**.
2. Navigate to **Websites** -> Manage your website.
3. On the left sidebar, find the **Databases** section and click on **Management**.
4. In the "Create a New MySQL Database and Database User" section:
   - Enter a **MySQL database name**.
   - Enter a **MySQL username**.
   - Generate a strong **Password**.
   - Click **Create**.
5. *Save the Database Name, Username, and Password.* Note the Host (usually `localhost` or an IP like `127.0.0.1` since the API will run on the same hosting provider).
6. Click on **phpMyAdmin** in hPanel to enter the database and import your database schema or run your `seed.js` script from your local machine (temporarily changing the host to Hostinger's remote database IP if allowed, or simply running the SQL via phpMyAdmin).

### Step 2: Prepare the Backend (Node.js API)

#### Update Environment Variables
We need to update your backend's `.env` configuration (locally and on production):
```env
DB_HOST=localhost
DB_USER=your_hostinger_db_user
DB_PASSWORD=your_hostinger_db_password
DB_NAME=your_hostinger_db_name
PORT=3000
```

#### Modify `server.js` 
Ensure your `server.js` connects correctly to the Hostinger database using the credentials.

### Step 3: Deploy the Backend on Hostinger

1. In hPanel, go to **Advanced** -> **Node.js**.
2. Click **Create Application**.
3. Fill in the required details:
   - **Application URL:** Choose the domain or subdomain (e.g., `api.yourdomain.com`).
   - **Application startup file:** `server.js` (or `index.js`).
   - **Custom Environment Variables:** Add your `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, and other keys like S3 credentials.
4. Upload your `backend` folder contents (excluding `node_modules`) using the File Manager or FTP to the directory specified for your Node.js app.
5. In the Node.js hPanel dashboard, click **Stop App**, then **NPM Install**, then **Start App**.
6. Verify your API is running by visiting `api.yourdomain.com` (or whatever route you chose).

### Step 4: Prepare and Deploy the Frontend (React/Vite)

#### Update API Base URL
In the frontend code, we need to update the base URL for API requests to point to your new live backend URL (e.g., `https://api.yourdomain.com` instead of `http://localhost:5000`).
*We will replace hardcoded `localhost` URLs with an environment variable or the production URL.*

#### Build the Project
1. Run `npm run build` in your `frontend` directory.
2. This generates a `dist` folder containing static HTML, JS, and CSS files.

#### Upload to Hostinger
1. In hPanel, go to **Files** -> **File Manager**.
2. Navigate to your main domain's `public_html` directory (e.g., `domains/yourdomain.com/public_html`).
3. Upload the contents of the `dist` folder directly into `public_html`.
4. Ensure an `.htaccess` file is present in `public_html` to handle React Router client-side routing.

## Verification Plan

### Database Verification
- Log into Hostinger phpMyAdmin and verify that tables (`students`, `attendance`, `marks`) are created successfully.

### API Verification
- Call `https://api.yourdomain.com/api/students` in a browser or Postman to ensure it returns data without throwing 500 errors.

### Frontend Verification
- Visit your main domain and test navigating tabs, registering a student, and ensuring that API calls are executing successfully against the live backend instead of localhost.
