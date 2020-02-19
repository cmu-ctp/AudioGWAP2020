/**
 * cli.js
 * CLI Bootstraper.
 */

// Load .env file
require('dotenv').config();

const commander = require('commander');

const register = require('./cli/register');
const packageConfig = require('./package.json');

const program = new commander.Command();
program
  .name('echoes-cli')
  .version(packageConfig.version);

register(program);

program.parse(process.argv);

// Show help if no command specified
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
