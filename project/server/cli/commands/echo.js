/**
 * Echo Test Command.
 */

const App = require('../app');

module.exports = (program) => {
  program
    .command('echo <msg>')
    .description('print the passed in message')
    .option('-r, --repeat', 'Repeat message')
    .action((msg, cmdObj) => {
      const app = App.create();
      
      app.run(async (ctx) => {
        console.log('Echo: ' + msg);
        if (cmdObj.repeat) {
          console.log('Repeat: ' + msg);
        }
      });
    });
};
