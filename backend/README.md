# Laxan Dashboard Backend

Backend API server for Laxan Educational Dashboard & Accounting Portal.

## Available Scripts

- `npm run dev`: Start the development server using nodemon (`server.js`).
- `npm run create-user`: Launch the interactive CLI to add or update portal users with bcrypt hashed passwords.
- `npm run seed:fees`: Seed or verify cloud fee datasets.

## User Management Quick Reference

To add or update accounting portal users:

```bash
# Interactive mode
npm run create-user

# Direct command mode
node create_user.js <username> <password> [role] [email]
```

For full documentation on roles, permissions, database schemas, and security configurations, refer to [ACCOUNTING_USER_GUIDE.md](../ACCOUNTING_USER_GUIDE.md).
