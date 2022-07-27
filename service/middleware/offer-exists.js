'use strict';

const {HttpCode} = require(`../../constants`);

module.exports = (offerService) => async (req, res, next) => {
  const {offerId} = req.params;
  let offer;

  try {
    offer = await offerService.findOne({offerId});

    if (!offer) {
      return res.status(HttpCode.NOT_FOUND).send(`not found`);
    }

  } catch (err) {
    return res.status(HttpCode.FORBIDDEN).send(err);
  }

  res.locals.offer = offer;
  return next();
};
