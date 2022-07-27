'use strict';
const fs = require(`fs/promises`);
const sequelize = require(`../lib/sequelize`);
const initDb = require(`../lib/init-db`);
const {getLogger} = require(`../lib/logger`);
const logger = getLogger({name: `filldb`});
const chalk = require(`chalk`);
const bcrypt = require(`bcrypt`);

const {getRandomInt, shuffle, getRandomPictureName, getRandomDate, getRandomSubarray} = require(`../../utils`);
const {
  MIN_POST,
  MAX_POST,
  PATH_OF_TITLES,
  PATH_OF_DESCRIPTIONS,
  PATH_OF_CATEGORIES,
  PATH_OF_COMMENTS,
  ExitCode} = require(`../../constants`);

const roles = [`user`, `author`, `admin`];

const users = [
  {
    firstname: `Иван`,
    lastname: `Иванов`,
    email: `ivanov@example.com`,
    passwordHash: bcrypt.hashSync(`123456`, 10),
    avatar: `avatar01.jpg`,
    roleId: `1`
  }, {
    firstname: `Пётр`,
    lastname: `Петров`,
    email: `petrov@example.com`,
    passwordHash: bcrypt.hashSync(`123456`, 10),
    avatar: `avatar02.jpg`,
    roleId: `2`
  },
  {
    firstname: `Алексей`,
    lastname: `Ычь`,
    email: `alex@example.com`,
    passwordHash: bcrypt.hashSync(`123456`, 10),
    avatar: `avatar03.jpg`,
    roleId: `2`
  },
  {
    firstname: `Артем`,
    lastname: `Рябков`,
    email: `gold_100@bk.ru`,
    passwordHash: bcrypt.hashSync(`123456`, 10),
    avatar: `avatar04.jpg`,
    roleId: `3`
  }
];

const asyncReadFile = async (filePath) => {
  try {
    const fileData = await fs.readFile(filePath, `utf8`);
    return fileData.trim().split(`\n`);
  } catch (err) {
    console.info(err);
    return [];
  }
};

const generatePost = async (count, titles, descriptions, comments, usersCount, categories) => {
  return Array(count).fill({}).map(() => ({
    title: titles[getRandomInt(0, titles.length - 1)],
    type: getRandomInt(0, 1) === 1 ? `offer` : `sale`,
    sum: getRandomInt(1000, 10000),
    description: shuffle(descriptions).slice(0, getRandomInt(0, descriptions.length - 1)).join(` `),
    picture: getRandomPictureName(),
    createdAt: getRandomDate(),
    userId: getRandomInt(1, usersCount),
    comments: getRandomSubarray(comments),
    categories: getRandomSubarray(categories)
  }));
};

const generateComments = async (comments, usersCount) => {
  return Array(comments.length - 1).fill({}).map(() => ({
    text: shuffle(comments)[getRandomInt(0, comments.length - 1)],
    offerId: getRandomInt(1, usersCount),
    userId: getRandomInt(1, usersCount)
  }));
};


module.exports = {
  name: `--fill-db`,
  run: async (argv) => {
    const count = parseInt(argv, 10) || MIN_POST;

    if (count > MAX_POST) {
      console.error(chalk.red(`Не более 1000 объявлений`));
      process.exit(ExitCode.ERROR);
    }

    const titles = await asyncReadFile(PATH_OF_TITLES);
    const descriptions = await asyncReadFile(PATH_OF_DESCRIPTIONS);
    const categories = await asyncReadFile(PATH_OF_CATEGORIES);
    const comments = await asyncReadFile(PATH_OF_COMMENTS);
    const commentsData = await generateComments(comments, users.length);

    const posts = await generatePost(count, titles, descriptions, commentsData, users.length, categories);

    try {
      logger.info(chalk.yellow(`Connection to DB...`));
      await sequelize.authenticate();
    } catch (err) {
      logger.info(chalk.red(`Error to connect with DB: ${err.message}`));
      process.exit(ExitCode.ERROR);
    }

    logger.info(chalk.green(`Connection to database established`));

    return initDb(sequelize, {posts, categories, commentsData, users, roles});

  }
};
