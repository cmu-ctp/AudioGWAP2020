/**
 * Events Clear Command.
 */

const inquirer = require('inquirer');
const colors = require('colors');

const App = require('../app');
const Event = require('../../models/event');

module.exports = (program) => {
  program
    .command('event:clear')
    .description('clear all the events')
    .action((cmdObj) => {
      const app = App.create({useMiddleware: true});
      
      app.run(async (ctx) => {
        const answer = await inquirer.prompt({
          type: 'confirm',
          name: 'confirmClear',
          message: 'Are you sure to delete all the events?',
          default: false
        });

        if (!answer.confirmClear) {
          console.log('Command cancelled.');
          return;
        }

        const eventModel = new Event(ctx);
        await eventModel.removeAll();
        console.log(colors.green('All the events have been deleted.'));
      });
    });
};
