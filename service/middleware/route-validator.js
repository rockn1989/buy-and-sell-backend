'use strict';

const {HttpCode} = require(`../../constants`);

const routeValidator = (schema) => async (req, res, next) => {
  const id = parseInt(req.params.offerId, 10);

  try {
    await schema.validateAsync(id);
  } catch (e) {
    const {details} = e;
    const errorsList = details.map((err) => err.message);

    return res.status(HttpCode.BAD_REQUEST).send(errorsList);
  }
  return next();
};

module.exports = routeValidator;
