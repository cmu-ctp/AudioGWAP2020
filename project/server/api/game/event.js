/* eslint-disable require-atomic-updates */
/**
 * event.js
 * Game event routes.
 */

const Router = require('koa-router');

const Event = require('../../models/event');
const Sound = require('../../models/sound');

const router = new Router();

/**
 * GET /game/events/fake/sound
 * Get all the sound list of an event.
 */
router.get('/events/fake/sound', async (ctx) => {
  const soundModel = new Sound(ctx);
  const itemList = await soundModel.findQueryWithUser({
    'event_id': 'fake'
  });

  ctx.body = {
    'msg': 'Success',
    'result': itemList
  };
});

/**
 * GET /game/events/:token/sound
 * Get all the sound list of an event.
 */
router.get('/events/:token/sound', async (ctx) => {
  const gameToken = ctx.params.token;
  const eventModel = new Event(ctx);
  const event = await eventModel.findByToken(gameToken);
  if (event === null) {
    ctx.throw(404, 'Event not found');
  }

  const eventId = event.id;

  const soundModel = new Sound(ctx);
  const itemList = await soundModel.findQueryWithUser({
    'event_id': eventId
  });

  ctx.body = {
    'msg': 'Success',
    'result': itemList
  };
});

module.exports = router;
