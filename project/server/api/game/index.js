/**
 * index.js
 * Game routes collector.
 */

const fs = require('fs');
const path = require('path');
const Router = require('koa-router');

const router = new Router();
const scriptName = path.basename(__filename);
const dirName =  __dirname;

const gameApiPrefix = '/game';

// Scan all the files under current dir and register routes
fs.readdirSync(dirName)
  .filter(file =>
    file != scriptName &&
    fs.statSync(path.join(dirName, file)).isFile())
  .forEach((route) => {
    router.use(gameApiPrefix, require(`./${route}`).routes());
  });

module.exports = router;
