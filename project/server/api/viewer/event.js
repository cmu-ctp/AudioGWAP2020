/* eslint-disable require-atomic-updates */
/**
 * event.js
 * Viewer event routes.
 */

const Router = require('koa-router');

const Event = require('../../models/event');

const router = new Router();

/**
 * GET /viewer/events
 * Get all the events.
 */
router.get('/events', async (ctx) => {
  const model = new Event(ctx);
  model.hideUnpublishedEvents();

  const itemList = await model.findAllWithCreator();

  ctx.body = {
    'msg': 'Success',
    'result': itemList
  };
});

/**
 * GET /viewer/events/joined
 * Get all the joined events.
 */
router.get('/events/joined', async (ctx) => {
  const uid = ctx.user.uid;
  
  const model = new Event(ctx);
  model.hideUnpublishedEvents();

  const itemList = await model.findQueryWithCreator({
    'joined_users': [uid]
  });

  ctx.body = {
    'msg': 'Success',
    'result': itemList
  };
});

/**
 * GET /viewer/events/:id
 * Get event detail.
 */
router.get('/events/:id', async (ctx) => {
  const eventId = ctx.params.id;

  const model = new Event(ctx);
  model.hideUnpublishedEvents();

  const item = await model.findWithCreator(eventId);

  if (item === null) {
    ctx.throw(404, 'Event not found');
  }

  ctx.body = {
    'msg': 'Success',
    'result': item
  };
});

/**
 * POST /viewer/events/:id/exit
 * Exit an event.
 */
router.post('/events/:id/exit', async (ctx) => {
  const uid = ctx.user.uid;
  const eventId = ctx.params.id;

  const model = new Event(ctx);
  model.hideUnpublishedEvents();

  const item = await model.find(eventId);

  if (item === null) {
    ctx.throw(404, 'Event not found');
  }

  await model.exit(eventId, uid);

  ctx.body = {
    'msg': 'Success'
  };
});

/**
 * POST /viewer/events/:id/join
 * Join an event.
 */
router.post('/events/:id/join', async (ctx) => {
  const uid = ctx.user.uid;
  const eventId = ctx.params.id;

  const model = new Event(ctx);
  model.hideUnpublishedEvents();
  
  const item = await model.find(eventId);

  if (item === null) {
    ctx.throw(404, 'Event not found');
  }

  await model.join(eventId, uid);

  ctx.body = {
    'msg': 'Success'
  };
});

module.exports = router;
