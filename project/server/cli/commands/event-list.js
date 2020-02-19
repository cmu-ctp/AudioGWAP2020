/**
 * Event Query Command.
 */

const prettyoutput = require('prettyoutput');

const App = require('../app');
const Event = require('../../models/event');

function filterList(list) {
  return JSON.parse(JSON.stringify(list));
}

module.exports = (program) => {
  program
    .command('event:list')
    .description('find all the events')
    .option('-c, --creator', 'Show event creator')
    .action((cmdObj) => {
      const app = App.create({useMiddleware: true});
      
      app.run(async (ctx) => {
        const eventModel = new Event(ctx);
        const eventList = await (cmdObj.creator ? eventModel.findAllWithCreator() : eventModel.findAll());
        console.log(prettyoutput(filterList(eventList)));
      });
    });
};
