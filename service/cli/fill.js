'use strict';
const fs = require(`fs/promises`);
const chalk = require(`chalk`);

const {getRandomInt, shuffle, getRandomPictureName, getRandomDate} = require(`../../utils`);
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
    firstName: `Иван`,
    lastName: `Иванов`,
    email: `ivanov@example.com`,
    passwordHash: `5f4dcc3b5aa765d61d8327deb882cf99`,
    avatar: `avatar1.jpg`
  }, {
    firstName: `Пётр`,
    lastName: `Петров`,
    email: `petrov@example.com`,
    passwordHash: `5f4dcc3b5aa765d61d8327deb882cf99`,
    avatar: `avatar2.jpg`
  },
  {
    firstName: `Артем`,
    lastName: `Рябков`,
    email: `gold_100@bk.ru`,
    passwordHash: `5f4dcc3b5aa765d61d8327deb882cf99`,
    avatar: `avatar2.jpg`
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

const generatePost = async (count, titles, descriptions, comments, usersCount) => {
  return Array(count).fill({}).map(() => ({
    id: getRandomInt(1, usersCount),
    type: getRandomInt(0, 1) === 1 ? `offer` : `sale`,
    title: titles[getRandomInt(0, titles.length - 1)],
    sum: getRandomInt(1000, 10000),
    description: shuffle(descriptions).slice(0, getRandomInt(0, descriptions.length - 1)).join(` `),
    picture: getRandomPictureName(),
    createdAt: getRandomDate(),
    userId: getRandomInt(1, usersCount),
    comments: comments.slice(0, getRandomInt(0, comments.length - 1))
  }));
};

const generateComments = async (comments, usersCount) => {
  return Array(comments.length - 1).fill({}).map(() => ({
    id: getRandomInt(0, usersCount),
    comment: shuffle(comments)[getRandomInt(0, comments.length - 1)],
    createdAt: getRandomDate(),
    userId: getRandomInt(1, usersCount),
    offerId: getRandomInt(1, usersCount)
  }));
};


module.exports = {
  name: `--fill`,
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

    const posts = await generatePost(count, titles, descriptions, commentsData, users.length);
    const postComments = posts.flatMap((offer) => offer.comments);

    const offerCategories = posts.map((_post, index) => ({offerId: index + 1, categoryId: getRandomInt(1, categories.length - 1)}));
    const userRoles = users.map((_user, index) => ({userId: index + 1, roleId: getRandomInt(1, users.length - 1)}));

    const categoryValue = categories.map((category) => {
      return `('${category}')`;
    }).join(`,\n`);

    const roleValue = roles.map((role) => `('${role}')`).join(`,\n`);

    const userValue = users.map(({firstName, lastName, email, passwordHash, avatar}) => {
      return `('${firstName}', '${lastName}', '${email}', '${passwordHash}', '${avatar}')`;
    }).join(`,\n`);

    const offerValue = posts.map(({title, type, sum, description, createdAt, picture, userId}) => {
      return `('${title}', '${type}', '${sum}', '${description}', '${createdAt}', '${picture}', ${userId})`;
    }).join(`,\n`);

    const commentValue = postComments.map(({comment, createdAt, userId, offerId}) => {
      return `('${comment}', '${createdAt}', ${userId}, ${offerId})`;
    }).join(`,\n`);

    const offerCategory = offerCategories.map(({offerId, categoryId}) => {
      return `(${offerId}, ${categoryId})`;
    }).join(`,\n`);

    const userRole = userRoles.map(({userId, roleId}) => {
      return `(${userId}, ${roleId})`;
    }).join(`,\n`);

    const content = `
      INSERT INTO categories(name) VALUES
      ${categoryValue};
      INSERT INTO roles(name) VALUES
      ${roleValue};
      INSERT INTO users(firstname, lastname, email, password_hash, avatar) VALUES
      ${userValue};
      INSERT INTO offers(title, type, sum, description, created_at, picture, user_id) VALUES
      ${offerValue};
      CREATE INDEX ON offers(title);
      INSERT INTO comments(comment, created_at, user_id, offer_id) VALUES
      ${commentValue};
      INSERT INTO offers_categories(offer_id, category_id) VALUES
      ${offerCategory};
      INSERT INTO users_roles(user_id, role_id) VALUES
      ${userRole};
    `;

    try {
      await fs.writeFile(`fill-generated-sql.sql`, content);
      console.info(chalk.green(`File created`));
      process.exit(ExitCode.SUCCESS);
    } catch (err) {
      console.info(chalk.red(`Can't write data in file...`));
      process.exit(ExitCode.ERROR);
    }
  }
};
