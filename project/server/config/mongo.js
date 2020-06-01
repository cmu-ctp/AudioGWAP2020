/**
 * mongo.js
 * MongoDB configuration.
 */

module.exports = {
  connection: {
    host: process.env.MONGO_HOST || 'localhost',
    port: process.env.MONGO_PORT || 27017,

    db: process.env.MONGO_DB || 'echoes',

    user: process.env.MONGO_USERNAME || 'myUserAdmin',
    pass: process.env.MONGO_PASSWORD || 'D0nt=123',
    authSource: process.env.MONGO_AUTH_SOURCE || 'admin',

    // Pool Setting
    max: 100,
    min: 1, 

    // Timeout
    acquireTimeoutMillis: 1500
  }
};
