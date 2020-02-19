/**
 * CLI Context for lib registration.
 */

const createError = require('http-errors');

module.exports = {
  /**
   * Shortcut to throw an error.
   */
  throw(...args) {
    throw createError(...args);
  },
};
