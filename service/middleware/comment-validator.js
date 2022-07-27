'use strict';

const {HttpCode} = require(`../../constants`);

const commentValidator = (schema) => async (req, res, next) => {
  const comment = req.body;

  try {
    await schema.validateAsync(comment, {abortEarly: false});
  } catch (e) {
    const {details} = e;
    const errorsList = details.map((err) => err.message);

    return res.status(HttpCode.BAD_REQUEST)
      .send(errorsList);
  }

  return next();
};

module.exports = commentValidator;
