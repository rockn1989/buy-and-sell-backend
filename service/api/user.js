'use strict';

const {Router} = require(`express`);
const passwordUtils = require(`../lib/password`);
const {HttpCode} = require(`../../constants`);
const userValidator = require(`../middleware/user-validator`);
const authValidator = require(`../middleware/auth-validator`);
const UserSchema = require(`../schema/user-schema`);

const refreshTokenUtils = require(`../middleware/refresh-token`);

const {REGISTER_FORBIDDEN_ERROR} = require(`../../constants`);

module.exports = (app, userService, tokenService) => {
  const route = new Router();
  app.use(`/user`, route);

  route.post(`/register`, userValidator(UserSchema, userService), async (req, res) => {
    const data = req.body;
    data.passwordHash = await passwordUtils.hash(data.password);

    try {
      const user = await userService.create(data);

      if (!user) {
        return res.status(HttpCode.FORBIDDEN).send({errorsList: [REGISTER_FORBIDDEN_ERROR]});
      }
    } catch (error) {
      return res.status(HttpCode.FORBIDDEN).send({errorsList: [REGISTER_FORBIDDEN_ERROR]});
    }
    return res.status(HttpCode.CREATED).send(`Ok`);
  });


  route.post(`/auth`, authValidator(userService), async (req, res) => {
    const {id, firstname, lastname, avatar, roleId} = res.locals.user;

    return res.status(HttpCode.OK).json({id, firstname, lastname, avatar, roleId});
  });

  route.post(`/refresh`, refreshTokenUtils(tokenService), async (req, res) => {
    const {newAccessToken: accessToken, newRefreshToken: refreshToken} = res.locals.tokens;
    res.status(HttpCode.OK).json({accessToken, refreshToken});
  });
};
