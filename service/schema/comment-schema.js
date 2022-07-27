'use strict';
const Joi = require(`joi`);

const {
  CommentSchema,
  COMMETN_TEXT_MIN,
} = require(`../../constants`);

module.exports = Joi.object({
  text: Joi.string().min(COMMETN_TEXT_MIN).required().messages({
    'string.min': CommentSchema.TEXT_MIN,
    'any.required': CommentSchema.TEXT_EMPTY
  }),
  userId: Joi.number().integer().positive().required().messages({
    'number.base': CommentSchema.USER_ID
  })
});
