'use strict';

const Joi = require(`joi`);
const {
  UserSchema,
  PASSWORD_MIN
} = require(`../../constants`);

module.exports = Joi.object({
  firstname: Joi.string().pattern(/[^0-9$&+,:;=?@#|'<>.^*()%!]+$/).required().messages({
    'string.pattern.base': UserSchema.TEXT_ERROR,
    'any.required': UserSchema.EMPTY_FIELD,
  }),
  lastname: Joi.string().pattern(/[^0-9$&+,:;=?@#|'<>.^*()%!]+$/).required().messages({
    'string.pattern.base': UserSchema.TEXT_ERROR,
    'any.required': UserSchema.EMPTY_FIELD,
  }),
  email: Joi.string().email().required().messages({
    'string.email': UserSchema.EMAIL_PATTERN,
    'any.required': UserSchema.EMPTY_FIELD,
  }),
  password: Joi.string().min(PASSWORD_MIN).required().messages({
    'string.min': UserSchema.PASSWORD_LENGTH,
    'any.required': UserSchema.EMPTY_FIELD
  }),
  passwordRepeated: Joi.string().valid(Joi.ref(`password`)).required().messages({
    'any.only': UserSchema.PASSWORD_REPEAT,
    'any.required': UserSchema.EMPTY_FIELD
  }),
  avatar: Joi.string().allow(null, ``)
});
