/**
 * index.js
 * Streamer routes collector.
 */

const fs = require('fs');
const path = require('path');
const Router = require('koa-router');

const userAuth = require('../../lib/session').auth;

const router = new Router();
const scriptName = path.basename(__filename);
const dirName =  __dirname;

const streamApiPrefix = '/streamer';

// Authentication
router.use(userAuth({blockRequest: true}));

// Create a fake user
// router.use(async (ctx, next) => {
//   ctx.user = {
//     uid: 1,
//     role: 'streamer',   // TODO: Switch to enum
//     isStreamer: () => true,
//     isViewer: () => false
//   };
//   await next();
// });

// Scan all the files under current dir and register routes
fs.readdirSync(dirName)
  .filter(file =>
    file != scriptName &&
    fs.statSync(path.join(dirName, file)).isFile())
  .forEach((route) => {
    router.use(streamApiPrefix, require(`./${route}`).routes());
  });

module.exports = router;
