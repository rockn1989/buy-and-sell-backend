'use strict';

const request = require(`supertest`);
const express = require(`express`);
const Sequelize = require(`sequelize`);

const initDb = require(`../lib/init-db`);
const category = require(`./category`);
const CategoryService = require(`../data-service/category-service`);
const {HttpCode} = require(`../../constants`);

const mockDB = new Sequelize(`sqlite::memory`, {logging: false});
const app = express();
app.use(express.json());

const mockCategories = [
  `Журналы`,
  `Игры`,
  `Животные`
];

const mockData = [
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
    "sum": 79555
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
    passwordHash: `5f4dcc3b5aa765d61d8327deb882cf99`,
    avatar: `avatar1.jpg`,
    roleId: `1`
  }, {
    firstname: `Пётр`,
    lastname: `Петров`,
    email: `petrov@example.com`,
    passwordHash: `5f4dcc3b5aa765d61d8327deb882cf99`,
    avatar: `avatar2.jpg`,
    roleId: `2`
  },
  {
    firstname: `Артем`,
    lastname: `Рябков`,
    email: `gold_100@bk.ru`,
    passwordHash: `5f4dcc3b5aa765d61d8327deb882cf99`,
    avatar: `avatar2.jpg`,
    roleId: `3`
  }
];
const mockRoles = [`user`, `author`, `admin`];

beforeAll(async () => {
  await initDb(mockDB, {categories: mockCategories, posts: mockData, users: mockUsers, roles: mockRoles});
  category(app, new CategoryService(mockDB));
});

describe(`CATEGORIES: POSITIVE`, () => {
  let response;

  beforeAll(async () => {
    response = await request(app).get(`/categories`);
  });

  test(`Status code 200`, () => {
    expect(response.statusCode).toBe(HttpCode.OK);
  });

  test(`List of 3 categories`, () => {
    expect(response.body.length).toBe(3);
  });

  test(`Categories names is Журнал, игры, животные`, () => {
    expect(response.body.map((it) => it.name)).toEqual(expect.arrayContaining(mockCategories));
  });
});
