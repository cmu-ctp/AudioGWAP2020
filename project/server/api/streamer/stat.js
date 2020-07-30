/* eslint-disable require-atomic-updates */
/**
 * stat.js
 * Streamer stat routes.
 */

const Router = require('koa-router');
const router = new Router();

const Event = require('../../models/event');
const Sound = require('../../models/sound');

/**
 * GET /streamer/events/fake/stat/users
 */
router.get('/events/fake/stat/users', async (ctx) => {
  const soundModel = new Sound(ctx);
  const userStat = await soundModel.getUserStat({
    event_id: 'fake'
  });

  ctx.body = {
    'msg': 'Success',
    'result': userStat
  };
});

/**
 * GET /streamer/events/:id/stat/users
 */
router.get('/events/:id/stat/users', async (ctx) => {
  const uid = ctx.user.uid;
  const eventId = ctx.params.id || '';
  console.log("Request received to fetch stats for the event "+eventId);

  const eventModel = new Event(ctx);
  const item = await eventModel.find(eventId);

  if (item === null || item.uid !== uid) {
    ctx.throw(404, 'Event not found');
  }

  const soundModel = new Sound(ctx);
  const userStat = await soundModel.getUserStat({
    event_id: eventModel.getObjectId(eventId)
  });

  ctx.body = {
    'msg': 'Success',
    'result': userStat
  };
});

/**
 * GET /streamer/events/fake/stat/categories
 */
router.get('/events/fake/stat/categories', async (ctx) => {
  const soundModel = new Sound(ctx);
  const categoryStat = await soundModel.getCategoryStat({
    event_id: 'fake'
  });

  ctx.body = {
    'msg': 'Success',
    'result': categoryStat
  };
});

/**
 * GET /streamer/events/:id/stat/categories
 */
router.get('/events/:id/stat/categories', async (ctx) => {
  const uid = ctx.user.uid;
  const eventId = ctx.params.id;

  const eventModel = new Event(ctx);
  const item = await eventModel.find(eventId);

  if (item === null || item.uid !== uid) {
    ctx.throw(404, 'Event not found');
  }

  const soundModel = new Sound(ctx);
  const categoryStat = await soundModel.getCategoryStat({
    event_id: eventModel.getObjectId(eventId)
  });

  ctx.body = {
    'msg': 'Success',
    'result': categoryStat
  };
});


module.exports = router;
