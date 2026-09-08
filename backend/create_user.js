/**
 * backend/create_user.js
 * CLI utility to securely add or update users for Laxan Accounting Portal.
 *
 * Usage:
 *   node create_user.js <username> <password> [role] [email]
 * Or run interactively:
 *   node create_user.js
 */

require('dotenv').config();
const bcrypt = require('bcryptjs');
const readline = require('readline');
const pool = require('./config/db');

function askQuestion(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) => rl.question(query, (ans) => {
    rl.close();
    resolve(ans.trim());
  }));
}

async function run() {
  let [,, argUser, argPass, argRole, argEmail] = process.argv;

  let username = argUser;
  let password = argPass;
  let role = argRole;
  let email = argEmail;

  if (!username) {
    console.log('\n=== Laxan Portal User Management ===\n');
    username = await askQuestion('Enter username: ');
  }

  if (!username) {
    console.error('Error: Username cannot be empty.');
    process.exit(1);
  }

  if (!password) {
    password = await askQuestion('Enter password: ');
  }

  if (!password || password.length < 6) {
    console.error('Error: Password must be at least 6 characters long.');
    process.exit(1);
  }

  if (!role) {
    const inputRole = await askQuestion('Enter role [admin/accountant/user] (default: accountant): ');
    role = inputRole || 'accountant';
  }

  if (!email) {
    const inputEmail = await askQuestion(`Enter email (default: ${username}@laxan.com): `);
    email = inputEmail || `${username}@laxan.com`;
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if user already exists
    const [existing] = await pool.query(
      'SELECT id, username FROM users WHERE username = ? OR email = ?',
      [username, email]
    );

    if (existing.length > 0) {
      const existingUser = existing[0];
      console.log(`\nUser "${existingUser.username}" already exists (ID: ${existingUser.id}).`);
      
      let confirmUpdate = 'y';
      if (!argUser) {
        confirmUpdate = await askQuestion('Do you want to update this user\'s password and role? (y/n): ');
      }

      if (confirmUpdate.toLowerCase() === 'y') {
        await pool.query(
          'UPDATE users SET password = ?, role = ?, email = ? WHERE id = ?',
          [hashedPassword, role, email, existingUser.id]
        );
        console.log(`✓ User "${username}" updated successfully!`);
      } else {
        console.log('Action cancelled. No changes made.');
      }
    } else {
      await pool.query(
        'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
        [username, email, hashedPassword, role]
      );
      console.log(`\n✓ New user "${username}" (${role}) created successfully!`);
    }

    console.log('\nCurrent Portal Users:');
    const [allUsers] = await pool.query('SELECT id, username, email, role, created_at FROM users');
    console.table(allUsers);
  } catch (err) {
    console.error('Error creating user:', err.message || err);
  } finally {
    process.exit(0);
  }
}

run();
