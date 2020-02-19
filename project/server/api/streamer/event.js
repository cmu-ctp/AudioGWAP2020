/* eslint-disable require-atomic-updates */
/**
 * event.js
 * Streamer event routes.
 */

const Router = require('koa-router');
const Joi = require('@hapi/joi');

const Event = require('../../models/event');

const router = new Router();

const eventSchema = Joi.object({
  title: Joi.string().required(),
  desc: Joi.string().required(),
  time: Joi.date().required(),
  categories: Joi.object().min(1).pattern(Joi.string(), Joi.array().items(Joi.string())).required(),
  is_published: Joi.boolean().default(true)
});

const eventUpdateSchema = Joi.object({
  title: Joi.string(),
  desc: Joi.string(),
  time: Joi.date(),
  categories: Joi.object().min(1).pattern(Joi.string(), Joi.array().items(Joi.string())),
  is_published: Joi.boolean()
}).min(1);

/**
 * GET /streamer/events
 * Get events of the current streamer.
 */
router.get('/events/', async (ctx) => {
  const uid = ctx.user.uid;
  
  const model = new Event(ctx);
  const itemList = await model.findQuery({
    'uid': uid
  });

  ctx.body = {
    'msg': 'Success',
    'result': itemList
  };
});

/**
 * GET /streamer/events/upcoming
 * Get upcoming events of the current streamer.
 */
router.get('/events/upcoming', async (ctx) => {
  const uid = ctx.user.uid;
  
  const model = new Event(ctx);
  const itemList = await model.findQuery({
    'uid': uid,
    'time': {
      // Events in the future or less than 1 hour ago
      '$gte': new Date(Date.now() - 3600 * 1000)
    }
  });

  ctx.body = {
    'msg': 'Success',
    'result': itemList
  };
});

/**
 * GET /streamer/events
 * Get past events of the current streamer.
 */
router.get('/events/past', async (ctx) => {
  const uid = ctx.user.uid;
  
  const model = new Event(ctx);
  const itemList = await model.findQuery({
    'uid': uid,
    'time': {
      // Events more than 1 hour ago
      '$lt': new Date(Date.now() - 3600 * 1000)
    }
  });

  ctx.body = {
    'msg': 'Success',
    'result': itemList
  };
});

/**
 * GET /streamer/events/:id
 * Get event detail.
 */
router.get('/events/:id', async (ctx) => {
  const uid = ctx.user.uid;
  const eventId = ctx.params.id;

  const model = new Event(ctx);
  const item = await model.find(eventId);

  if (item === null || item.uid !== uid) {
    ctx.throw(404, 'Event not found');
  }

  ctx.body = {
    'msg': 'Success',
    'result': item
  };
});

/**
 * GET /streamer/events/:id
 * Get event detail.
 */
router.get('/events/:id/token', async (ctx) => {
  const uid = ctx.user.uid;
  const eventId = ctx.params.id;

  const model = new Event(ctx);
  const item = await model.findWithToken(eventId);

  if (item === null || item.uid !== uid) {
    ctx.throw(404, 'Event not found');
  }

  ctx.body = {
    'msg': 'Success',
    'result': item.game_token || ''
  };
});

/**
 * POST /streamer/events
 * Create a new event.
 */
router.post('/events', async (ctx) => {
  const uid = ctx.user.uid;
  let eventData = Object.create(ctx.request.body);  // clone request body

  // Validate event data
  try {
    eventData = await eventSchema.validateAsync(eventData);
  } catch (err) {
    ctx.throw(400, err);
  }

  eventData.uid = uid;
  
  const model = new Event(ctx);
  const newItem = await model.create(eventData);

  ctx.body = {
    'msg': 'Success',
    'result': {
      'id': newItem.id
    }
  };
});

/**
 * PUT /streamer/events/:id
 * Update an existing event.
 */
router.put('/events/:id', async (ctx) => {
  const uid = ctx.user.uid;
  const eventId = ctx.params.id;
  let eventData = Object.create(ctx.request.body);  // clone request body

  // Validate event data
  try {
    eventData = await eventUpdateSchema.validateAsync(eventData);
  } catch (err) {
    ctx.throw(400, err);
  }

  const model = new Event(ctx);
  const item = await model.find(eventId);

  if (item === null || item.uid !== uid) {
    ctx.throw(404, 'Event not found');
  }

  await model.update(eventId, eventData);

  ctx.body = {
    'msg': 'Success'
  };
});

/**
 * DELETE /streamer/events/:id
 * Delete an event.
 */
router.delete('/events/:id', async (ctx) => {
  ctx.body = { 'msg': 'Not implemented' };

  // const id = ctx.params.id;
  // const model = new Event(ctx);

  // // TODO: Check if the event belongs to the streamer

  // await model.remove(id);

  // ctx.body = { 'msg': 'Success' };
});

module.exports = router;
