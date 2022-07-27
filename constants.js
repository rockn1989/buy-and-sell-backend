'use strict';

const path = require(`path`);

const DEFAULT_COMMAND = `--help`;

const DEFAULT_PORT = 3000;

const USER_ARGV_INDEX = 2;

const MIN_POST = 1;
const MAX_POST = 1000;

const OFFERS_PER_PAGE = 8;

const PATH_OF_TITLES = path.resolve(`./data/titles.txt`);
const PATH_OF_DESCRIPTIONS = path.resolve(`./data/descriptions.txt`);
const PATH_OF_CATEGORIES = path.resolve(`./data/categories.txt`);
const PATH_OF_COMMENTS = path.resolve(`./data/comments.txt`);
const PATH_OF_API_LOG = `./logs/api.log`;

const ExitCode = {
  SUCCESS: 1,
  ERROR: 0
};

const Env = {
  DEVELOPMENT: `development`,
  PRODUCTION: `production`
};

const HttpCode = {
  OK: 200,
  CREATED: 201,
  DELETED: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
};

const OfferSchema = {
  TITLE_MIN: `Заголовок должен содержать минимум 10 символов`,
  TITLE_MAX: `Заголовок не должен содержать более 100 символов`,
  TITLE_EMPTY: `Заголовок не должен быть пустым`,
  TYPE_EMPTY: `Не выбран тип объявления`,
  DESCRIPTION_MIN: `Текст должен содержать минимум 50 символов`,
  DESCRIPTION_MAX: `Текст не должен содержать более 1000 символов`,
  DESCRIPTION_EMPTY: `Текст не должен быть пустым`,
  SUM_MIN: `Минимальная стоимость 100`,
  REQUIRED: `Это поле обязательно для заполнения`,
  CATEGORY: `Не выбрана ни одна категория`,
  PICTURE_PATTERN: `Неверный тип изображения. PNG или JPG`,
  PICTURE_NOT_EMPTY: `Не выбрано изображение`
};

const CommentSchema = {
  TEXT_MIN: `Текст комментария должен быть не менее 20 символов`,
  TEXT_EMPTY: `Нельзя отправить пустой комментарий`,
  USER_ID: `Некорректный идентификатор пользователя`
};

const UserSchema = {
  TEXT_ERROR: `Имя и фамилия не должно содержать специальных символов и цифр`,
  EMAIL_PATTERN: `Не валидный адрес почты`,
  PASSWORD_LENGTH: `Пароль содержит меньше 6-ти символов`,
  PASSWORD_REPEAT: `Пароли не совпадают`,
  EMPTY_FIELD: `Обязательное поле для заполнения`,
};

const OFFER_SCHEMA_TITLE_MIN = 10;
const OFFER_SCHEMA_TITLE_MAX = 100;
const OFFER_SCHEMA_DESCRIPTION_MIN = 50;
const OFFER_SCHEMA_DESCRIPTION_MAX = 1000;
const OFFER_SCHEMA_SUM_MIN = 100;

const COMMETN_TEXT_MIN = 20;

const PASSWORD_MIN = 6;

const REGISTER_FORBIDDEN_ERROR = `Произошла ошибка на сервере. Попробуйте зарегистрироваться позже`;

module.exports = {
  DEFAULT_COMMAND,
  DEFAULT_PORT,
  USER_ARGV_INDEX,
  OFFERS_PER_PAGE,
  MIN_POST,
  MAX_POST,
  PATH_OF_TITLES,
  PATH_OF_DESCRIPTIONS,
  PATH_OF_CATEGORIES,
  PATH_OF_COMMENTS,
  PATH_OF_API_LOG,
  ExitCode,
  HttpCode,
  Env,
  OfferSchema,
  CommentSchema,
  UserSchema,
  OFFER_SCHEMA_TITLE_MIN,
  OFFER_SCHEMA_TITLE_MAX,
  OFFER_SCHEMA_DESCRIPTION_MIN,
  OFFER_SCHEMA_DESCRIPTION_MAX,
  OFFER_SCHEMA_SUM_MIN,
  COMMETN_TEXT_MIN,
  PASSWORD_MIN,
  REGISTER_FORBIDDEN_ERROR
};
