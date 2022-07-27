'use strict';

const {compare} = require(`../lib/password`);
const {HttpCode} = require(`../../constants`);

module.exports = (service) => async (req, res, next) => {
  const {email, password} = req.body;
  let userExists = null;

  try {
    userExists = await service.findByEmail(email);

    if (!userExists) {
      return res.status(HttpCode.UNAUTHORIZED).send({errorsList: [`Неверный логин или пароль`]});
    }

    const passwordIsCorrect = await compare(password, userExists.passwordHash);

    if (!passwordIsCorrect) {
      return res.status(HttpCode.UNAUTHORIZED).send({errorsList: [`Неверный логин или пароль`]});
    }

  } catch (err) {
    return res.status(HttpCode.BAD_REQUEST).send({errorsList: [`В данный момент не возможно авторизоваться`]});
  }

  delete userExists.passwordHash;

  res.locals.user = userExists;

  return next();
};
