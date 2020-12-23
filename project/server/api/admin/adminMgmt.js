/**
 * adminMgmt.js
 * Routes for managing the admins & permissions of users
 */

const Router = require('koa-router');
const User = require('../../models/user');
const Joi = require('@hapi/joi');

const userAuth = require('../../lib/session').authRole;

const router = new Router();

const updateRoleSchema = Joi.object({
  user: Joi.string(),
  role: Joi.number().min(0).max(2)
}).min(1);

router.use(userAuth({ blockRequest: true, roleRequired: 2 }));

/**
 * @api {PUT} /admin/mgmt Change Admin Roles
 * @apiName ChangeAdminRoles
 * @apiGroup Admin
 * @apiDescription Change the role of the given user to the given role
 * 
 * @apiParam  {String} user Twitch username of user
 * @apiParam  {Number} role Role to be given (0 = viewer, 1 = admin, 2 = superadmin)
 * @apiParamExample  {json} Request-Example:
 * {
 *     user: 'teamechoesetc'
 *     role: 1
 * }
 * 
 * @apiSuccessExample {type} Success-Response:
 * {
 *     msg : 'Success'
 * }
 * 
 * @apiUse Unauthorized
 * @apiPermission superadmin
 */
router.put('/mgmt', async (ctx) => {
  // console.log(ctx.request.body);
  let roleData = Object.create(ctx.request.body);

  try {
    roleData = await updateRoleSchema.validateAsync(roleData);
  } catch (err) {
    ctx.throw(400, err);
  }

  const UserModel = new User(ctx);
  const userRequested = await UserModel.findByUserName(roleData.user);
  if (userRequested === null) {
    ctx.throw(404, 'User not found. Make sure to use their username, and not their display name.');
  }

  try {
    let roleObj = { role: roleData.role }
    await UserModel.updateInfo(userRequested.uid, roleObj);
    ctx.body = {
      'msg': 'Success'
    }
  } catch (err) {
    console.log(err);
    ctx.throw(500, err);
  }
})

module.exports = router;