/**
 * session.js
 * Session configuration.
 */

module.exports = {
  jwt: {
    secret: process.env.APP_SECRET || 'jwt-secret',
    cookie: 'echoes_auth_token'
  }
};
