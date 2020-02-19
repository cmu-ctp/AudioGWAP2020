/**
 * CLI Application Wrapper.
 */

const compose = require('koa-compose');

const context = require('./context');
const registerMiddleware = require('./../middleware');

class CliApplication {
  /**
   * Initialize a new `CliApplication` for cli tool.
   *
   * @api public
   */

  constructor(options) {
    options = options || {};
  
    this.env = options.env || process.env.NODE_ENV || 'development';
    this.middleware = [];
    this.context = Object.create(context);
    this.request = Object.create(null);
    this.response = Object.create(null);

    this.is_cli = true;
  }

  /**
   * Use the given middleware `fn`.
   *
   * Old-style middleware will be converted.
   *
   * @param {Function} fn
   * @return {Application} self
   * @api public
   */

  use(fn) {
    if (typeof fn !== 'function') throw new TypeError('middleware must be a function!');
    this.middleware.push(fn);
    return this;
  }

  /**
   * Run the CLI program.
   * @param {Function} fnProgram 
   * @api public
   */

  run(fnProgram) {
    const fn = compose([...this.middleware, fnProgram]);

    const ctx = this.createContext();
    (async () => await fn(ctx))()
      .catch(e => {
        console.log(e);
        // We have to exit here to avoid promises blocking the process
        process.exit(1);
      });
  }

  /**
   * Create a fake context.
   * @api private
   */

  createContext() {
    const context = Object.create(null);
    context.request = Object.create(this.request);
    context.response = Object.create(this.response);
    context.app = this;
    context.originalUrl = null;
    context.state = {};
    return context;
  }
}

module.exports = CliApplication;

module.exports.create = (options) => {
  options = Object.assign({
    useMiddleware: false
  }, options);

  const app = new CliApplication();
  
  if (options.useMiddleware) {
    registerMiddleware(app);
  }

  return app;
};
