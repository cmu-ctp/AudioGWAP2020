/**
 * routes/index.js
 * Server route entry.
 */

const compose = require('koa-compose');
const Router = require('koa-router');

const authApi = require('./auth');
const streamerApi = require('./streamer');
const viewerApi = require('./viewer');
const gameApi = require('./game');

const apiPrefix = '/api';

const api = () => {
  const router = new Router();

  // Api without auth
  router.use(apiPrefix, gameApi.routes());
  router.use(apiPrefix, authApi.routes());
  
  router.use(apiPrefix, streamerApi.routes());
  router.use(apiPrefix, viewerApi.routes());

  router.all('*', (ctx) => {
    ctx.throw(404, 'Not Found');
  });

  // Combine middlewares
  return compose([router.routes(), router.allowedMethods()]);
};

module.exports = api;
