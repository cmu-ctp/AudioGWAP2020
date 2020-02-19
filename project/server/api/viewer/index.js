/**
 * index.js
 * Viewer routes collector.
 */

const fs = require('fs');
const path = require('path');
const Router = require('koa-router');

const userAuth = require('../../lib/session').auth;

const router = new Router();
const scriptName = path.basename(__filename);
const dirName =  __dirname;

const viewerApiPrefix = '/viewer';

// Authentication
router.use(userAuth({blockRequest: true}));

// Create a fake user
// router.use(async (ctx, next) => {
//   ctx.user = {
//     uid: 10,
//     role: 'viewer',   // TODO: Switch to enum
//     isStreamer: () => false,
//     isViewer: () => true
//   };
//   await next();
// });

// Scan all the files under current dir and register routes
fs.readdirSync(dirName)
  .filter(file =>
    file != scriptName &&
    fs.statSync(path.join(dirName, file)).isFile())
  .forEach((route) => {
    router.use(viewerApiPrefix, require(`./${route}`).routes());
  });

module.exports = router;
