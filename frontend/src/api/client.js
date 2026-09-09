// frontend/src/api/client.js
// Centralized API client with structured error logging and JWT auth bearer injection

import { logger } from '../utils/logger';

const API_BASE = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const method = options.method || 'GET';

  // Attach JWT Bearer token if available
  const headers = { ...options.headers };
  const token = sessionStorage.getItem('accounting_token') || localStorage.getItem('accounting_token');
  if (token && !headers['Authorization'] && !headers['authorization']) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  logger.debug('API Request', `${method} ${endpoint}`);

  try {
    const res = await fetch(url, {
      ...options,
      headers
    });

    if (!res.ok) {
      // If unauthorized on accounting routes (and not during login attempt), clear expired credentials
      if (res.status === 401 && endpoint.includes('/accounting') && !endpoint.includes('/login')) {
        logger.warn('Auth', `Session expired or invalid for ${endpoint}, redirecting to login modal`);
        sessionStorage.removeItem('accounting_token');
        sessionStorage.removeItem('accounting_user');
        localStorage.removeItem('accounting_token');
        localStorage.removeItem('accounting_user');
        window.dispatchEvent(new Event('accounting:unauthorized'));
      }

      const text = await res.text();
      let errorMessage = `HTTP ${res.status} (${res.statusText})`;
      try {
        const json = JSON.parse(text);
        if (json.error || json.message) {
          errorMessage = json.error || json.message;
        }
      } catch {
        if (text) errorMessage = text;
      }

      const err = new Error(errorMessage);
      err.status = res.status;
      err.endpoint = endpoint;

      logger.error('API Error', `${method} ${endpoint} returned status ${res.status}: ${errorMessage}`);
      throw err;
    }

    return await res.json();
  } catch (err) {
    // If it was already logged as an HTTP failure above, avoid duplicate logs unless it was a network failure
    if (!err.status) {
      logger.error('API Network', `Failed to connect to backend for ${method} ${endpoint}: ${err.message}`);
    }
    throw err;
  }
}
