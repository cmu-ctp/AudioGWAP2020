/**
 * List Command.
 */

module.exports = (program) => {
  program
    .command('help')
    .description('list all the available commands')
    .action((cmdObj) => {
      program.outputHelp();
    });
};
