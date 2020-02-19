/**
 * server.js
 * Server app bootstraper.
 */

// Load .env file
require('dotenv').config();

const Koa = require('koa');

const api = require('./api');
const registerMiddleware = require('./middleware');
const app = new Koa();

// Register middlewares
registerMiddleware(app);

// Bind routes
app.use(api());

// Start server
app.listen(process.env.APP_PORT || 3000);
