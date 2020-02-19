/**
 * mongo.js
 * MongoDB adapter.
 */

const koaMongo = require('./koa-mongo');
const config = require('../config');

// MongoDB is injected into ctx.db or ctx.mongo.db(dbName)
const mongo = () => koaMongo(config.mongo.connection);

module.exports = mongo;
