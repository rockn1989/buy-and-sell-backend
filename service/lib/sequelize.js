"use strict";
const Sequelize = require(`sequelize`);
require(`dotenv`).config();

const { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD, DB_DIALECT } =
  process.env;
const variablesNotExists = [
  DB_HOST,
  DB_PORT,
  DB_NAME,
  DB_USER,
  DB_PASSWORD,
  DB_DIALECT,
].some((el) => el === undefined);

if (variablesNotExists) {
  throw new Error(
    `Не установлены все переменные окружения для подключения к БД`
  );
}

const dbOptions = {
  host: DB_HOST,
  dialect: DB_DIALECT,
  pool: {
    max: 5,
    min: 0,
    acquire: 10000,
    idle: 10000,
  },
  logging: false,
};

if (process.env.NODE_ENV === `production`) {
  dbOptions.dialectOptions = {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  };
}

module.exports = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, { ...dbOptions });
