/**
 * error.js
 * Error utility.
 */

const httpErrors = require('http-errors');

const ErrorUtil = {
  error() {
    return async (ctx, next) => {
      try {
        await next();
      } catch (err) {
        ctx.status = err.status || 500;
        ctx.body = {
          msg: (ctx.status !== 500) ? err.message : 'Internal Server Error',
          code: ctx.status,
          failed: true
        };
        ctx.app.emit('error', err, ctx);
      }
    }
  },

  create(code, msg, data) {
    return httpErrors(code, msg, data);
  },

  unauthorized(msg, data) {
    return this.create(401, msg, data);
  },

  forbidden(msg, data) {
    return this.create(403, msg, data);
  },

  notexist(msg, data) {
    return this.create(404, msg, data);
  },

  conflict(msg, data) {
    return this.create(409, msg, data);
  },
};

module.exports = ErrorUtil;
