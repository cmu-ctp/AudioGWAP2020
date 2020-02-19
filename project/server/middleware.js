/**
 * middleware.js
 * Middleware Registrator.
 */

const koaBody = require('koa-body');
const koaCors = require('@koa/cors');

const mongo = require('./lib/mongo');
const session = require('./lib/session');
const oauth = require('./lib/oauth');
const jwt = require('./lib/jwt');

const errorUtil = require('./util/error');

module.exports = (app) => {
  if (app.is_cli) {   // CLI Mode

    // App keys
    app.keys = ['session secret'];

    // Register contexts
    app.use(mongo());

  } else {            // Server Mode

    // App keys
    app.keys = ['session secret'];

    // Error handler
    app.use(errorUtil.error());

    // Register contexts
    app.use(mongo());
    app.use(session.register(app));
    app.use(koaBody({ multipart: true }));
    app.use(koaCors({
      credentials: true,
      keepHeadersOnError: true,
    }));
    app.use(oauth());
    app.use(jwt.register());

  }
};
