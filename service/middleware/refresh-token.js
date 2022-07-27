'use strict';

const jwt = require(`jsonwebtoken`);
const {HttpCode} = require(`../../constants`);
const {makeTokens} = require(`../lib/jwt-helper`);

require(`dotenv`).config();
const {JWT_REFRESH_SECRET} = process.env;

module.exports = (service) => async (req, res, next) => {
  const {token} = req.body;

  let newAccessToken;
  let newRefreshToken;

  if (!token) {
    return res.sendStatus(HttpCode.BAD_REQUEST);
  }

  const existToken = await service.find(token);

  if (!existToken) {
    return res.sendStatus(HttpCode.NOT_FOUND);
  }

  jwt.verify(token, JWT_REFRESH_SECRET, async (err, userData) => {
    if (err) {
      console.log(err);
      return res.sendStatus(HttpCode.FORBIDDEN);
    }

    const {id, firstname, lastname, avatar, roleId} = userData;
    const {accessToken, refreshToken} = makeTokens({id, firstname, lastname, avatar, roleId});

    newAccessToken = accessToken;
    newRefreshToken = refreshToken;

    await service.delete(existToken);
    await service.add(refreshToken);
    return next();
  });

  res.locals.tokens = {newAccessToken, newRefreshToken};
  return next();
};
