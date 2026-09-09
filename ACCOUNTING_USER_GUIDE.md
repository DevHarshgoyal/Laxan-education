# Laxan Accounting Portal — User Management & Authentication Guide

This document provides complete instructions for managing user access and credentials for the **Laxan Institutional Accounting Portal** (`/laxan/account`).

---

## 1. Overview & Security Architecture

Access to the Accounting section and institutional report endpoints is strictly protected:

- **Frontend Route**: `/laxan/account`
- **Backend API Routes**: `/api/accounting/*`
- **Authentication**: JWT (JSON Web Token) with 8-hour validity.
- **Password Storage**: Salted `bcrypt` hashes (plaintext passwords are strictly rejected).
- **Brute-Force Protection**: IP rate-limiting allows a maximum of 10 login attempts per 15-minute window.
- **Session Lifecycle**: User credentials and tokens are stored in `sessionStorage` and automatically purged whenever the user logs out, closes the tab, or navigates away from the accounting portal.

---

## 2. Database Schema (`users` Table)

Portal user credentials reside in the `users` table within the `laxan_dashboard` MySQL database:

```sql
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) UNIQUE,
  email VARCHAR(100) UNIQUE,
  password VARCHAR(255),
  role VARCHAR(50) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### Available Roles
| Role | Access Level | Description |
|---|---|---|
| `admin` | Full Administrative | Unrestricted access to reports, finances, and system settings |
| `accountant` | Financial Operations | View financial ledgers, day-wise collections, remaining dues, and admission fees |
| `user` | Standard Staff | Restricted read access |

### Active Authorized Accounts (Default Seed)
| Username | Role | Default Password |
|---|---|---|
| `admin1` | `admin` | `laxanadmin1@2026India` |
| `accountant1` | `accountant` | `laxanaccountant1@2026India` |
| `admin2` | `admin` | `laxanadmin2@2026India` |
| `accountant2` | `accountant` | `laxanaccountant2@2026India` |

### How Default Users Are Automatically Created on Deployment

When the backend starts up in any environment (local, staging, or production), it automatically ensures that database tables and baseline administrator/accountant accounts are present:

1. **Trigger**:
   Inside [`backend/controllers/accountingController.js`](file:///c:/Users/Anshul%20computers/.gemini/antigravity/scratch/laxan-dashboard/backend/controllers/accountingController.js), the function `ensureUsersTableAndSeed()` is called automatically on module load when `node server.js` boots:
   ```javascript
   // backend/controllers/accountingController.js (Line 48)
   ensureUsersTableAndSeed();
   ```

2. **Execution Steps**:
   - **Schema Verification**: Runs `CREATE TABLE IF NOT EXISTS users (...)` to guarantee the authentication table exists without causing migration errors.
   - **Count Check**: Executes `SELECT COUNT(*) as count FROM users`.
   - **Initial Seeding**: If `count === 0` (which occurs on a new deployment or empty database), it automatically encrypts each default password using `bcrypt.hash(password, 10)` and inserts the accounts above into the production database.
   - **Idempotency**: If the table already contains user records (`count > 0`), the seeder skips insertion entirely, preserving any custom or modified credentials.

> [!TIP]
> Once your production environment is live, you can change the passwords of these default accounts or create new accounts at any time using `npm run create-user` or `node create_user.js`. The startup script will **never** overwrite existing accounts.

---

## 3. How to Add or Update Users

### Method 1: Interactive CLI Prompt (Easiest)

1. Open your terminal and navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Run the user creation command:
   ```bash
   npm run create-user
   ```
3. Follow the interactive prompts:
   ```text
   === Laxan Portal User Management ===

   Enter username: sharma_accounts
   Enter password: SecurePassword@2026
   Enter role [admin/accountant/user] (default: accountant): accountant
   Enter email (default: sharma_accounts@laxan.com): sharma@laxan.com

   ✓ New user "sharma_accounts" (accountant) created successfully!
   ```
4. If the username already exists, the script asks if you'd like to update their password and role.

---

### Method 2: Direct Command Line (Single Command)

You can create or update a user in a single command by passing arguments:

```bash
cd backend
node create_user.js <username> <password> [role] [email]
```

#### Examples:

- **Add an Accountant:**
  ```bash
  node create_user.js pooja LaxanAccounts#2026 accountant pooja@laxan.com
  ```

- **Add an Administrator:**
  ```bash
  node create_user.js vikas AdminMaster#2026 admin vikas@laxan.com
  ```

---

### Method 3: Direct MySQL Query

If you prefer to insert users directly through a MySQL client (e.g. phpMyAdmin, MySQL Workbench, or CLI):

```sql
INSERT INTO users (username, email, password, role)
VALUES (
  'new_accountant',
  'accountant@laxan.com',
  '$2a$10$exampleBcryptHashGeneratedSecurely...',
  'accountant'
);
```

> [!CAUTION]
> **Do not insert plain text passwords into the database!**
> The authentication controller strictly enforces `bcrypt.compare`. If the `password` field does not begin with `$2a$` or `$2b$`, login attempts will be automatically rejected.

---

## 4. How to Delete or Deactivate a User

To remove a user's portal access, run the following SQL statement in MySQL:

```sql
-- Delete a user by username
DELETE FROM users WHERE username = 'sharma_accounts';

-- Or view all current users
SELECT id, username, email, role, created_at FROM users;
```

---

## 5. Security & Configuration Settings

### JWT Secret Key
Configured in `backend/.env`:
```env
JWT_SECRET=laxan_institute_secure_jwt_secret_key_2026_x9f#q
```
*In production environments, ensure `JWT_SECRET` is set to a long, random cryptographic string.*

### Rate Limiter Settings
Configured in `backend/middleware/rateLimiter.js`:
- **Window**: 15 minutes (`15 * 60 * 1000` ms)
- **Max attempts**: 10 requests per IP
