'use strict';

const jwt = require(`jsonwebtoken`);
require(`dotenv`).config();

const {JWT_ACCESS_SECRET, JWT_REFRESH_SECRET} = process.env;

module.exports.makeTokens = (tokenData) => {
  const accessToken = jwt.sign(tokenData, JWT_ACCESS_SECRET, {expiresIn: `300s`});
  const refreshToken = jwt.sign(tokenData, JWT_REFRESH_SECRET);
  return {accessToken, refreshToken};
};
