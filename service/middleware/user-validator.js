'use strict';

const {HttpCode} = require(`../../constants`);

module.exports = (schema, service) => async (req, res, next) => {
  const userData = req.body;

  try {
    await schema.validateAsync(userData, {abortEarly: false});
  } catch (e) {
    const {details} = e;
    const errorsList = details.map((err) => err.message);

    return res.status(HttpCode.BAD_REQUEST)
      .send({errorsList});
  }

  const userExists = await service.findByEmail(req.body.email);

  if (userExists) {
    return res.status(HttpCode.BAD_REQUEST).send({errorsList: [`Пользователь с таким email уже зарегистрирован`]});
  }

  return next();
};
