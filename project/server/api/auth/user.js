/* eslint-disable require-atomic-updates */
/**
 * user.js
 * User routes.
 */

const Router = require('koa-router');
const Joi = require('@hapi/joi');

const User = require('../../models/user');

const userAuth = require('../../lib/session').auth;

const router = new Router();

router.use(userAuth({ blockRequest: true }));

const userUpdateSchema = Joi.object({
  game_meta: Joi.object({
    model: Joi.string()
  })
}).min(1);

/**
 * @api {GET} /users/info Get User Information
 * @apiName GetUserInfo
 * @apiGroup Auth
 * @apiDescription Get the information of the current user.
 *
 * @apiSuccess {String} uid           User id.
 * @apiSuccess {String} user_name     User login name.
 * @apiSuccess {String} display_name  User display name.
 * @apiSuccess {String} avatar_url    Avatar path.
 * @apiSuccess {String} model         Game piece model name. May be null if not set by user.
 *
 * @apiSuccessExample Success-Response:
 *     {
 *       msg: "Success",
 *       result: {
 *         uid: "462858971",
 *         user_name: "com_mouse",
 *         display_name: "com_mouse",
 *         avatar_url: "https://static-cdn.jtvnw.net/user-default-pictures-uv/998f01ae-def8-11e9-b95c-784f43822e80-profile_image-300x300.png",
 *         game_meta: {
 *           model: "Ghost"
 *         }
 *       }
 *     }
 *
 * @apiUse Unauthorized
 */
router.get('/users/info', async (ctx) => {
  const uid = ctx.user.uid;

  const userModel = new User(ctx);
  const userInfo = await userModel.findByUid(uid);

  ctx.body = {
    'msg': 'Success',
    'result': userInfo
  };
});

/**
 * @api {PUT} /users/info Update User Information
 * @apiName UpdateUserInfo
 * @apiGroup Auth
 * @apiDescription Update the information of the current user. Currently only game metadata are allowed to change.
 *
 * @apiParam {string} model  Game piece model name.
 * @apiParamExample {json} Request-Example:
 *     {
 *       game_meta: {
 *         model: "Ghost"
 *       }
 *     }
 *
 * @apiSuccessExample Success-Response:
 *     {
 *       msg: "Success"
 *     }
 *
 * @apiUse Unauthorized
 */
router.put('/users/info', async (ctx) => {
  const uid = ctx.user.uid;
  let userData = Object.create(ctx.request.body);  // clone request body

  // Validate event data
  try {
    userData = await userUpdateSchema.validateAsync(userData);
  } catch (err) {
    ctx.throw(400, err);
  }

  const userModel = new User(ctx);
  await userModel.updateInfo(uid, userData);

  ctx.body = {
    'msg': 'Success'
  };
});

module.exports = router;
