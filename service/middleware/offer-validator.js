'use strict';

const {HttpCode} = require(`../../constants`);


const offerValidator = (schema) => async (req, res, next) => {
  const {offerData: newOffer} = req.body;

  try {
    await schema.validateAsync(newOffer, {abortEarly: false});
  } catch (e) {
    const {details} = e;
    const errorsList = details.map((err) => err.message);

    return res.status(HttpCode.BAD_REQUEST)
      .send({errorsList});
  }

  return next();
};

module.exports = offerValidator;
