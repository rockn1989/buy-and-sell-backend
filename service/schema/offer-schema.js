'use strict';
const Joi = require(`joi`);

const {
  OfferSchema,
  OFFER_SCHEMA_TITLE_MIN,
  OFFER_SCHEMA_TITLE_MAX,
  OFFER_SCHEMA_DESCRIPTION_MIN,
  OFFER_SCHEMA_DESCRIPTION_MAX,
  OFFER_SCHEMA_SUM_MIN
} = require(`../../constants`);

module.exports = Joi.object({
  title: Joi.string().min(OFFER_SCHEMA_TITLE_MIN).max(OFFER_SCHEMA_TITLE_MAX).required().messages({
    'string.min': OfferSchema.TITLE_MIN,
    'string.max': OfferSchema.TITLE_MAX,
    'any.required': OfferSchema.TITLE_EMPTY
  }),
  description: Joi.string().min(OFFER_SCHEMA_DESCRIPTION_MIN).max(OFFER_SCHEMA_DESCRIPTION_MAX).required().messages({
    'string.min': OfferSchema.DESCRIPTION_MIN,
    'string.max': OfferSchema.DESCRIPTION_MAX,
    'any.required': OfferSchema.DESCRIPTION_EMPTY
  }),
  sum: Joi.number().integer().min(OFFER_SCHEMA_SUM_MIN).required().messages({
    'number.min': OfferSchema.SUM_MIN,
    'any.required': OfferSchema.REQUIRED
  }),
  type: Joi.string().required().messages({
    'any.required': OfferSchema.TYPE_EMPTY
  }),
  category: Joi.array().items(Joi.number().positive().messages({
    'number.base': OfferSchema.CATEGORY,
    'any.required': OfferSchema.CATEGORY
  })).min(1).required(),
  picture: Joi.string().pattern(new RegExp(`\.(?:pn|jp?)g`)).messages({
    'string.pattern': OfferSchema.PICTURE_PATTERN,
    'string.empty': OfferSchema.PICTURE_NOT_EMPTY
  })
});

