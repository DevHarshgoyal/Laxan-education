// frontend/src/utils/logger.js
// Structured frontend logging utility with dev-mode filters and styled prefixes

const isDev = import.meta.env.DEV;

const formatPrefix = (tag) => `[${tag}]`;

export const logger = {
  debug: (tag, ...args) => {
    if (isDev) {
      console.debug(`%c${formatPrefix(tag)}`, 'color: #94a3b8; font-weight: bold;', ...args);
    }
  },

  info: (tag, ...args) => {
    console.info(`%c${formatPrefix(tag)}`, 'color: #3b82f6; font-weight: bold;', ...args);
  },

  warn: (tag, ...args) => {
    console.warn(`%c${formatPrefix(tag)}`, 'color: #f59e0b; font-weight: bold;', ...args);
  },

  error: (tag, message, error) => {
    console.error(
      `%c${formatPrefix(tag)}`,
      'color: #ef4444; font-weight: bold;',
      message,
      error ? (error.stack || error.message || error) : ''
    );
  }
};
