'use strict';

const request = require(`supertest`);
const express = require(`express`);
const Sequelize = require(`sequelize`);
const initDb = require(`../lib/init-db`);
const bcrypt = require(`bcrypt`);

const user = require(`./user`);
const UserService = require(`../data-service/user-service`);
const {HttpCode} = require(`../../constants`);

const mockCategories = [
  `Журналы`,
  `Игры`,
  `Животные`
];

const mockOffers = [
  {
    "user": `ivanov@example.com`,
    "categories": [
      `Журналы`
    ],
    "comments": [
      {
        "user": `ivanov@example.com`,
        "text": `Почему в таком ужасном состоянии?`
      },
      {
        "user": `petrov@example.com`,
        "text": `Продаю в связи с переездом. Отрываю от сердца. А где блок питания?`
      }
    ],
    "description": `Таких предложений больше нет! Это настоящая находка для коллекционера! При покупке с меня бесплатная доставка в черте города. Если найдёте дешевле — сброшу цену.`,
    "picture": `item09.jpg`,
    "title": `Продам новую приставку Sony Playstation 5`,
    "type": `SALE`,
    "sum": 79555,
    "userId": 1
  },
  {
    "user": `petrov@example.com`,
    "categories": [
      `Игры`,
    ],
    "comments": [
      {
        "user": `ivanov@example.com`,
        "text": `Неплохо, но дорого. Совсем немного... Оплата наличными или перевод на карту?`
      },
      {
        "user": `petrov@example.com`,
        "text": `С чем связана продажа? Почему так дешёво? Вы что?! В магазине дешевле. Продаю в связи с переездом. Отрываю от сердца.`
      },
      {
        "user": `ivanov@example.com`,
        "text": `Неплохо, но дорого. Совсем немного...`
      },
      {
        "user": `petrov@example.com`,
        "text": `Вы что?! В магазине дешевле.`
      }
    ],
    "description": `При покупке с меня бесплатная доставка в черте города. Даю недельную гарантию. Это настоящая находка для коллекционера! Бонусом отдам все аксессуары.`,
    "picture": `item02.jpg`,
    "title": `Продам отличную подборку фильмов на VHS`,
    "type": `SALE`,
    "sum": 55460
  },
  {
    "user": `ivanov@example.com`,
    "categories": [
      `Животные`
    ],
    "comments": [
      {
        "user": `petrov@example.com`,
        "text": `Оплата наличными или перевод на карту? Продаю в связи с переездом. Отрываю от сердца. С чем связана продажа? Почему так дешёво?`
      }
    ],
    "description": `Даю недельную гарантию. Продаю с болью в сердце... Товар в отличном состоянии. Если найдёте дешевле — сброшу цену.`,
    "picture": `item12.jpg`,
    "title": `Куплю породистого кота`,
    "type": `SALE`,
    "sum": 81801
  }
];

const mockUsers = [
  {
    firstname: `Иван`,
    lastname: `Иванов`,
    email: `ivanov@example.com`,
    passwordHash: bcrypt.hashSync(`123456`, 10),
    avatar: `avatar1.jpg`,
    roleId: `1`
  }, {
    firstname: `Пётр`,
    lastname: `Петров`,
    email: `petrov@example.com`,
    passwordHash: bcrypt.hashSync(`123456`, 10),
    avatar: `avatar2.jpg`,
    roleId: `2`
  },
  {
    firstname: `Артем`,
    lastname: `Рябков`,
    email: `gold_100@bk.ru`,
    passwordHash: bcrypt.hashSync(`123456`, 10),
    avatar: `avatar2.jpg`,
    roleId: `3`
  }
];
const mockRoles = [`user`, `author`, `admin`];

const createAPI = async () => {
  const mockDB = new Sequelize(`sqlite::memory`, {logging: false});
  await initDb(mockDB, {categories: mockCategories, posts: mockOffers, users: mockUsers, roles: mockRoles});
  const app = express();
  app.use(express.json());

  user(app, new UserService(mockDB));
  return app;
};

describe(`User created  status 201`, () => {
  let app;

  const userData = {
    firstname: `Artem`,
    lastname: `Ryabkov`,
    email: `gold_2022@bk.ru`,
    password: `123456`,
    passwordRepeated: `123456`,
    avatar: ``
  };

  test(`Status code 201 when user created`, async () => {
    app = await createAPI();
    await request(app)
      .post(`/user/register`)
      .send(userData)
      .expect(HttpCode.CREATED);
  });


});

describe(`User error status 400`, () => {
  let app;

  const userData = {
    firstname: `Artem`,
    lastname: `Ryabkov`,
    email: `gold_2022@bk.ru`,
    password: `123456`,
    passwordRepeated: `123456`,
    avatar: ``
  };

  beforeAll(async () =>{
    app = await createAPI();
  });

  test(`Status code 400 when some fields is empty`, async () => {
    const badUserData = {...userData};

    for await (const key of Object.keys(userData)) {
      delete badUserData[key];

      await request(app)
        .post(`/user/register`)
        .send(badUserData)
        .expect(HttpCode.BAD_REQUEST);
    }
  });


});

describe(`Password: User error status 400`, () => {
  let app;

  const userData = {
    firstname: `Artem`,
    lastname: `Raybkov`,
    email: `gold_2022@bk.ru`,
    password: `123456`,
    passwordRepeated: `1234567`,
    avatar: ``
  };

  test(`Status code 400 when some passwords not equle`, async () => {
    app = await createAPI();
    await request(app)
      .post(`/user/register`)
      .send(userData)
      .expect(HttpCode.BAD_REQUEST);
  });
});

describe(`Email: User error status 400`, () => {
  let app;

  const userData = {
    firstname: `Artem`,
    lastname: `Raybkov`,
    email: `ivanov@example.com`,
    password: `123456`,
    passwordRepeated: `1234567`,
    avatar: ``
  };

  test(`Status code 400 when email is set`, async () => {
    app = await createAPI();
    await request(app)
      .post(`/user/register`)
      .send(userData)
      .expect(HttpCode.BAD_REQUEST);
  });
});

describe(`API authenicate user if data is valid`, () => {
  const validData = {
    email: `ivanov@example.com`,
    password: `123456`
  };

  let response;

  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app)
      .post(`/user/auth`)
      .send(validData);
  });

  test(`Status code is 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`User firstname is Иван`, () => expect(response.body.firstname).toBe(`Иван`));

});


describe(`API refuses to authenicate user if data is invalid`, () => {
  let app;

  beforeAll(async () => {
    app = await createAPI();
  });

  test(`If email is incorrect status is 401`, async () => {
    const badData = {
      email: `non-exists`,
      password: `123456`
    };

    await request(app)
      .post(`/user/auth`)
      .send(badData)
      .expect(HttpCode.UNAUTHORIZED);
  });

  test(`If password does not match status is 401`, async () => {
    const badData = {
      email: `ivanov@example.com`,
      password: `12345612`
    };

    await request(app)
      .post(`/user/auth`)
      .send(badData)
      .expect(HttpCode.UNAUTHORIZED);
  });
});
