/* eslint-disable require-atomic-updates */
/**
 * collect.js
 * Viewer audio collection routes.
 */

 
const path = require('path');
const fse = require('fs-extra');
const Router = require('koa-router');
const moment = require('moment');
const Joi = require('@hapi/joi');

const config = require('../../config');

const Event = require('../../models/event');
const Sound = require('../../models/sound');

const router = new Router();

const soundSchema = Joi.object({
  game_meta: Joi.object({
    model: Joi.string()
  }),
  meta: Joi.object({
    category: Joi.string().required(),
    label: Joi.string().allow(null)
  })
});

function getUploadDir() {
  return config.upload.dir;
}

function getUploadUrlPrefix() {
  return config.upload.urlPrefix;
}

function getTime() {
  return moment().format('YYYYMMDD_HHmmss');
}

/**
 * GET /viewer/sound
 */
router.get('/sound', async (ctx) => {  
  const uid = ctx.user.uid;

  const soundModel = new Sound(ctx);
  soundModel.hideUnpublishedEvents();
  const itemList = await soundModel.findQueryWithEvent({
    'uid': uid
  });

  ctx.body = {
    'msg': 'Success',
    'result': itemList
  };
});

/**
 * GET /viewer/event/:id/sound
 */
router.get('/events/:id/sound', async (ctx) => {  
  const eventId = ctx.params.id;
  const eventModel = new Event(ctx);
  eventModel.hideUnpublishedEvents();

  const event = await eventModel.find(eventId);
  if (event === null) {
    ctx.throw(404, 'Event not found');
  }

  const uid = ctx.user.uid;
  const userInEvent = await eventModel.userInEvent(eventId, uid);
  if (!userInEvent) {
    ctx.throw(403, 'You have to join the event to upload sound');
  }

  const soundModel = new Sound(ctx);
  const itemList = await soundModel.findQuery({
    'uid': uid,
    'event_id': eventModel.getObjectId(eventId)
  });

  ctx.body = {
    'msg': 'Success',
    'result': itemList
  };
});

/**
 * POST /viewer/event/fake/sound
 */
router.post('/events/fake/sound', async (ctx) => {
  // TODO: Fake method to show how upload works; replace with real logic
  const eventId = 'fake';

  const uid = ctx.user.uid;

  // create a temporary folder to store files
  const uploadDir = `${eventId}/${uid}`;
  const realEventDir = path.join(getUploadDir(), eventId);
  const realDir = path.join(getUploadDir(), uploadDir);

  // make the temporary directory
  try {
    if (!await fse.exists(realEventDir)) {
      await fse.mkdir(realEventDir);
    }
    if (!await fse.exists(realDir)) {
      await fse.mkdir(realDir);
    }
  } catch (e) {
    console.log(e);
    ctx.throw(500, 'Failed to create upload dir');
  }

  const files = ctx.request.files || {};
  const file = files.file;

  if (!file) {
    ctx.throw(400, 'No file for upload');
  }

  if (!ctx.request.body.sound) {
    ctx.throw(400, 'Sound info required');
  }

  let soundInfo;
  try {
    soundInfo = JSON.parse(ctx.request.body.sound);
    soundInfo = Object.assign({
      meta: {
        category: ''
      }
    }, soundInfo);
  } catch (e) {
    console.log(e);
    ctx.throw(400, 'Invalid sound info format');
  }

  // Validate sound data
  try {
    soundInfo = await soundSchema.validateAsync(soundInfo);
  } catch (err) {
    ctx.throw(400, err);
  }
  
  // Remove empty label
  if (!soundInfo.meta.label) {
    delete soundInfo.meta.label;
  }

  if (!['audio/wav', 'audio/wave', 'audio/x-wav'].includes(file.type) ||
      !file.name.endsWith('.wav')) {
    ctx.throw(400, 'Unsupported audio format');
  }

  if (file.size > 4 * 1024 * 1024) {  // 4MB
    ctx.throw(400, 'File size exceeds limit');
  }

  const soundModel = new Sound(ctx);
  const soundId = soundModel.createObjectId();
  let soundLabel = soundInfo.meta.label || soundInfo.meta.category || '';
  // Sanitize the label to avoid security issues
  soundLabel = soundLabel.replace(/[^a-zA-z0-9]/g, '').substring(0, 15); 

  const filename = getTime() + '_' + soundLabel + '_' + soundId + '.wav';
  const filePath = path.join(realDir, filename);
  const fileUrl = getUploadUrlPrefix() + uploadDir + `/${filename}`;

  try {
    const reader = fse.createReadStream(file.path);
    const writer = fse.createWriteStream(filePath);
    const promise = new Promise((resolve, reject) => {
      reader.on('error', error => reject(error));
      writer.on('error', error => reject(error));
      reader.on('end', response => resolve(response));
    });
    reader.pipe(writer);
    await promise;
  } catch (e) {
    console.log(e);
    ctx.throw(500, 'Failed to upload file');
  }

  const soundData = Object.create(soundInfo);

  // TODO: Verify soundData
  soundData.uid = uid;
  soundData.event_id = eventId;
  soundData.path = fileUrl;
  soundData._id = soundId;

  const soundItem = await soundModel.create(soundData);

  ctx.body = {
    'msg': 'success',
    'result': {
      'id': soundItem.id,
      'path': fileUrl
    }
  };
});

/**
 * POST /viewer/event/:id/sound
 */
router.post('/events/:id/sound', async (ctx) => {  
  const eventId = ctx.params.id;
  const eventModel = new Event(ctx);
  eventModel.hideUnpublishedEvents();

  const event = await eventModel.find(eventId);
  if (event === null) {
    ctx.throw(404, 'Event not found');
  }

  const uid = ctx.user.uid;
  const userInEvent = await eventModel.userInEvent(eventId, uid);
  if (!userInEvent) {
    ctx.throw(403, 'You have to join the event to upload sound');
  }

  // create a temporary folder to store files
  const uploadDir = `${eventId}/${uid}`;
  const realEventDir = path.join(getUploadDir(), eventId);
  const realDir = path.join(getUploadDir(), uploadDir);

  // make the temporary directory
  try {
    if (!await fse.exists(realEventDir)) {
      await fse.mkdir(realEventDir);
    }
    if (!await fse.exists(realDir)) {
      await fse.mkdir(realDir);
    }
  } catch (e) {
    console.log(e);
    ctx.throw(500, 'Failed to create upload dir');
  }

  const files = ctx.request.files || {};
  const file = files.file;

  if (!file) {
    ctx.throw(400, 'No file for upload');
  }

  if (!ctx.request.body.sound) {
    ctx.throw(400, 'Sound info required');
  }

  let soundInfo;
  try {
    soundInfo = JSON.parse(ctx.request.body.sound);
    soundInfo = Object.assign({
      meta: {
        category: ''
      }
    }, soundInfo);
  } catch (e) {
    console.log(e);
    ctx.throw(400, 'Invalid sound info format');
  }
  
  // Remove empty label
  if (!soundInfo.meta.label) {
    delete soundInfo.meta.label;
  }

  // Validate sound data
  try {
    soundInfo = await soundSchema.validateAsync(soundInfo);
  } catch (err) {
    ctx.throw(400, err);
  }

  if (!['audio/wav', 'audio/wave', 'audio/x-wav'].includes(file.type) ||
      !file.name.endsWith('.wav')) {
    ctx.throw(400, 'Unsupported audio format');
  }

  if (file.size > 4 * 1024 * 1024) {  // 4MB
    ctx.throw(400, 'File size exceeds limit');
  }

  const soundModel = new Sound(ctx);
  const soundId = soundModel.createObjectId();
  let soundLabel = soundInfo.meta.label || soundInfo.meta.category || '';
  // Sanitize the label to avoid security issues
  soundLabel = soundLabel.replace(/[^a-zA-z0-9]/g, '').substring(0, 15); 

  const filename = getTime() + '_' + soundLabel + '_' + soundId + '.wav';
  const filePath = path.join(realDir, filename);
  const fileUrl = getUploadUrlPrefix() + uploadDir + `/${filename}`;

  try {
    const reader = fse.createReadStream(file.path);
    const writer = fse.createWriteStream(filePath);
    const promise = new Promise((resolve, reject) => {
      reader.on('error', error => reject(error));
      writer.on('error', error => reject(error));
      reader.on('end', response => resolve(response));
    });
    reader.pipe(writer);
    await promise;
  } catch (e) {
    console.log(e);
    ctx.throw(500, 'Failed to upload file');
  }

  const soundData = Object.create(soundInfo);

  // TODO: Verify soundData
  soundData.uid = uid;
  soundData.event_id = soundModel.getObjectId(eventId);
  soundData.path = fileUrl;
  soundData._id = soundId;

  const soundItem = await soundModel.create(soundData);

  ctx.body = {
    'msg': 'success',
    'result': {
      'id': soundItem.id,
      'path': fileUrl
    }
  };
});

/**
 * DELETE /viewer/event/:id/sound/:sound_id
 */
router.delete('/events/:id/sound/:sound_id', async (ctx) => {  
  const eventId = ctx.params.id;
  const soundId = ctx.params.sound_id;

  const eventModel = new Event(ctx);
  eventModel.hideUnpublishedEvents();

  const event = await eventModel.find(eventId);
  if (event === null) {
    ctx.throw(404, 'Event not found');
  }

  const uid = ctx.user.uid;
  const userInEvent = await eventModel.userInEvent(eventId, uid);
  if (!userInEvent) {
    ctx.throw(403, 'You have to join the event first');
  }

  const soundModel = new Sound(ctx);
  const sound = await soundModel.find(soundId);
  if (sound === null || sound.uid !== uid) {
    ctx.throw(404, 'Sound not found');
  }

  await soundModel.remove(soundId);

  ctx.body = {
    'msg': 'Success'
  };
});

module.exports = router;
