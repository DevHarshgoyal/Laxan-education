const mysql = require('mysql2/promise');
const { AsyncLocalStorage } = require('async_hooks');
require('dotenv').config();

const asyncLocalStorage = new AsyncLocalStorage();
const pools = {};

// Default pool setup (using current env variables)
const defaultPool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'laxan_dashboard',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

pools['DEFAULT'] = defaultPool;

/**
 * Resolves or creates a connection pool for a specific institute.
 */
function getPoolForInstitute(instituteName) {
  if (!instituteName) {
    return defaultPool;
  }

  const nameUpper = instituteName.trim().toUpperCase();
  
  if (pools[nameUpper]) {
    return pools[nameUpper];
  }

  // Look up specific credentials in environment variables
  const host = process.env[`DB_${nameUpper}_HOST`] || process.env.DB_HOST || 'localhost';
  const user = process.env[`DB_${nameUpper}_USER`];
  const password = process.env[`DB_${nameUpper}_PASSWORD`];
  const database = process.env[`DB_${nameUpper}_NAME`];
  const port = process.env[`DB_${nameUpper}_PORT`] || process.env.DB_PORT || '3306';

  // Fallback to default database if specific settings are missing
  if (!user || !database) {
    console.warn(`[DB WARNING] No database credentials found for institute "${instituteName}". Falling back to default pool.`);
    return defaultPool;
  }

  console.log(`[DB INFO] Instantiating connection pool for institute "${nameUpper}" (DB: ${database})`);
  
  const pool = mysql.createPool({
    host,
    user,
    password,
    database,
    port: parseInt(port, 10),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

  pools[nameUpper] = pool;
  return pool;
}

// Proxy to dynamically route database calls to the request-specific connection pool
const dbProxy = new Proxy({}, {
  get(target, prop) {
    // Check if the caller wants asyncLocalStorage or helper functions directly
    if (prop === 'asyncLocalStorage') {
      return asyncLocalStorage;
    }
    if (prop === 'getPoolForInstitute') {
      return getPoolForInstitute;
    }
    if (prop === 'defaultPool') {
      return defaultPool;
    }

    // Retrieve active institute name from the current async execution context
    const activeInstituteName = asyncLocalStorage.getStore();
    const activePool = getPoolForInstitute(activeInstituteName);

    const value = activePool[prop];
    if (typeof value === 'function') {
      return value.bind(activePool);
    }
    return value;
  }
});

module.exports = dbProxy;

