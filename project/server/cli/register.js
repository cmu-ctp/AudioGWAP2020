/**
 * register.js
 * CLI Commands Registrator.
 */

const glob = require('glob');
const path = require('path');

module.exports = (program) => {
  // Scan all the files under commands dir and register commands
  glob.sync(__dirname + '/commands/**/*.js' )
    .forEach((commandFile) => {
      require(path.resolve(commandFile))(program);
    });

  // Error on unknown commands
  program.on('command:*', function () {
    console.error('Invalid command: %s\nSee --help for a list of available commands.', program.args.join(' '));
    process.exit(1);
  });
};
