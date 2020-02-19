/**
 * oauth.js
 * OAuth adapter.
 */

const grant = require('grant-koa');
const mount = require('koa-mount');
const config = require('../config');

const oauth = () => mount('/api', grant(config.oauth));

module.exports = oauth;
