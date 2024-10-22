
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

const votedLabel = Joi.object(
  {
    uid: Joi.string(),
    label: Joi.string()
  }
);
const soundSchema = Joi.object({
  game_meta: Joi.object({
    model: Joi.string()
  }),
  meta: Joi.object({
    category: Joi.string().required(),
    label: Joi.string().allow(null)
  }),
  sid: Joi.string().allow(null),
  isValidated: Joi.boolean(),
  votingRound: Joi.number(),
  votedLabels: Joi.array().items(votedLabel).allow(null),
  validatedLabel: Joi.string().allow(null),

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
 * GET /viewer/consent/revoke
 * Deletes all the sound uploaded by the user
 */
router.get('/consent/revoke', async (ctx) => {  
  const uid = ctx.user.uid;
  console.log(`Uid ${uid}`);
  const soundModel = new Sound(ctx);
  const totalSounds = await soundModel.deleteUserSound(uid);
  ctx.body = {
    'msg': totalSounds + ' were deleted from the server',
  };
});

/**
 * GET viewer/sound/retrieve
 * Given a user, retrieves an unvalidated sound from the DB for an event with minimum validated sound
 */

router.get('/sound/retrieve', async (ctx) => {  
  const soundModel = new Sound(ctx);
  const soundObj = await soundModel.getUnvalidatedSound(ctx);

  if(soundObj === null){
    ctx.body = {
      'msg': 'There are currently no new sounds for validation',
      'result': null
    }; 
    return;
  }
  
  ctx.body = {
    'msg': 'Successfully found unvalidated sound',
    'result': soundObj
  };

});

/**
 * GET viewer/sound/retrieve/event/:id
 * Given a user, retrieves an unvalidated sound from the DB for a given event
 */
router.get('/sound/retrieve/event/:id', async (ctx) => {
  const eventId = ctx.params.id;
  const uid = ctx.user.uid;
  const soundModel = new Sound(ctx);

  const soundObj = await soundModel.getUnvalidatedSoundForEvent(eventId, uid);

  if(soundObj === null){
    ctx.body = {
      'msg': 'There are currently no new sounds for validation',
      'result': null
    }; 
    return;
  }
  
  ctx.body = {
    'msg': 'Successfully found unvalidated sound',
    'result': soundObj
  };
  return ;

});

/**
 * POST /label/submit
 * Append the label submitted by user to an existing unvalidated sound clip in DB.
 */

router.post('/label/submit', async (ctx) => {
  try{
    const soundModel = new Sound(ctx);
    await soundModel.updateLabel(ctx);
    console.log('Label successfully submitted.');
    ctx.body = {
      'msg': 'Label sucessfully added',
    };
  } catch (err) {
    console.log('Label was not submitted');
    console.log(err);
    ctx.throw(400, err);
  }
});


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
 * POST /viewer/event/:id/sound
 */
router.post('/events/:id/sound', async (ctx) => {  

  console.log('Initially recorded sound object: '+ctx.request.body.sound);
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

  console.log('Successfully found sound info and created directory to upload sound');
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
  console.log('Successfully validated uploaded sound');

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
  soundData.sid = soundId.toString();
  soundData.votingRound = 0;
  soundData.votedLabels = null;
  soundData.isValidated = false;
  soundData.validatedLabel = null;
  soundData.uploadTime = new Date();

  const soundItem = await soundModel.create(soundData);
  console.log('Sound object '+JSON.stringify(soundData)+' was successfully saved uploaded sound');

  // Update corresponding event
  await eventModel.updateUnvalidatedSounds(soundData.event_id, 1);

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
