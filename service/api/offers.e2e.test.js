'use strict';

const request = require(`supertest`);
const express = require(`express`);
const Sequelize = require(`sequelize`);
const initDb = require(`../lib/init-db`);

const offers = require(`./offers`);
const OfferService = require(`../data-service/offers-service`);
const CommentService = require(`../data-service/comments-service`);
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

const createAPI = async () => {
  const mockDB = new Sequelize(`sqlite::memory`, {logging: false});
  await initDb(mockDB, {categories: mockCategories, posts: mockOffers, users: mockUsers, roles: mockRoles});
  const app = express();
  app.use(express.json());

  offers(app, new OfferService(mockDB), new CommentService(mockDB));
  return app;
};

describe(`POSITVE`, () => {

  describe(`OFFERS: GET`, () => {
    let app;
    let response;

    beforeAll(async () => {
      app = await createAPI();
      response = await request(app)
        .get(`/offers`);
    });

    test(`Status code 200`, () => {
      expect(response.statusCode).toBe(HttpCode.OK);
    });

    test(`Get offer counts`, () => {
      expect(response.body.length).toBe(3);
    });

  });

  describe(`OFFERS: POST`, () => {
    let app;
    const offer = {
      type: `offer`,
      title: `test test testtesttesttesttesttesttest`,
      description: `hellow world testtesttesttesttesttesttesttesttesttesttesttesttesttest`,
      sum: 4534,
      picture: `offer-01.jpg`,
      category: [1]
    };

    test(`Status code 201 offer when created with validate data`, async () => {
      app = await createAPI();
      await request(app)
        .post(`/offers`)
        .send(offer)
        .expect(HttpCode.CREATED);
    });

  });

  describe(`OFFERS: PUT`, () => {
    let app;
    let response;
    const offerData = {
      type: `offer`,
      title: `test testtesttesttesttesttesttest`,
      description: `hellow world testtesttesttesttesttesttesttesttesttesttesttesttesttest`,
      sum: 4534,
      picture: `offer-01.jpg`,
      category: [1, 2],
    };

    beforeAll(async () => {
      app = await createAPI();
      response = await request(app)
        .put(`/offers/1`)
        .send({offerData, userId: 1});
    });

    test(`Update offer`, () => {
      expect(response.statusCode).toBe(HttpCode.OK);
    });

  });

  describe(`OFFERS: DELETE`, () => {
    let app;
    let response;

    beforeAll(async () => {
      app = await createAPI();
      response = await request(app)
        .delete(`/offers/1`);
    });

    test(`Status code 204`, () => expect(response.statusCode).toBe(HttpCode.DELETED));

  });

  describe(`COMMENTS: GET`, () => {
    let app;
    let response;

    beforeAll(async () => {
      app = await createAPI();
      response = await request(app)
        .get(`/offers/1/comments`);
    });

    test(`Status code 200 for comments`, () => {
      expect(response.statusCode).toBe(HttpCode.OK);
    });
  });

  describe(`COMMENTS: POST`, () => {
    let app;
    let response;

    beforeAll(async () => {
      app = await createAPI();
      response = await request(app)
        .post(`/offers/1/comments`)
        .send({
          userId: 1,
          text: `Hello testtesttesttesttesttesttest`
        });
    });

    test(`Status code 201 for comments`, () => {
      expect(response.statusCode).toBe(HttpCode.CREATED);
    });
  });

  describe(`COMMENTS: DELETE`, () => {
    let app;
    let response;

    beforeAll(async () => {
      app = await createAPI();
      response = await request(app)
        .delete(`/offers/1/comments/1`);
    });

    test(`Status code 204 for comments when deleted`, () => {
      expect(response.statusCode).toBe(HttpCode.DELETED);
    });
  });

});

describe(`NEGATIVE`, () => {

  describe(`OFFERS: GET`, () => {
    let app;
    let response;

    beforeAll(async () => {
      app = await createAPI();
      response = await request(app)
        .get(`/offers/13`);
    });

    test(`Status code 404`, () => {
      expect(response.statusCode).toBe(HttpCode.NOT_FOUND);
    });

  });

  describe(`OFFERS: POST`, () => {
    const offer = {
      type: `offer`,
      title: `test hellow world `,
      description: `hellow world hellow world hellow world hellow world `,
      sum: 4534,
      picture: `offer-01.jpg`,
      category: [1]
    };

    let app;

    beforeAll(async () => {
      app = await createAPI();
    });

    test(`No validate data offer`, async () => {
      const badOffers = [
        {...offer, sum: true},
        {...offer, picture: 12345},
        {...offer, category: `Котики`}
      ];

      for await (const badOffer of badOffers) {
        await request(app)
          .post(`/offers`)
          .send({offerData: badOffer})
          .expect(HttpCode.BAD_REQUEST);
      }
    });

  });

  describe(`OFFERS: PUT`, () => {
    let app;
    let response;

    beforeAll(async () => {
      app = await createAPI();
      response = await request(app)
        .put(`/offers/55`);
    });

    test(`Update no exists offer`, () => {
      expect(response.statusCode).toBe(HttpCode.NOT_FOUND);
    });

  });

  describe(`OFFERS: DELETE`, () => {
    let app;
    let response;

    beforeAll(async () => {
      app = await createAPI();
      response = await request(app)
        .delete(`/offers/13`);
    });

    test(`Delete no exists offer`, () => {
      expect(response.statusCode).toBe(HttpCode.NOT_FOUND);
    });

  });

  describe(`COMMENTS: GET`, () => {
    let app;
    let response;

    beforeAll(async () => {
      app = await createAPI();
      response = await request(app)
        .get(`/offers/13/comments`);
    });

    test(`Get no exists comment`, () => {
      expect(response.statusCode).toBe(HttpCode.NOT_FOUND);
    });
  });

  describe(`COMMENTS: POST`, () => {
    let app;
    let response;

    beforeAll(async () => {
      app = await createAPI();
      response = await request(app)
        .post(`/offers/13/comments`)
        .send({
          userId: 1,
          text: `Hello`
        });
    });

    test(`Create comment for no exists offer`, () => {
      expect(response.statusCode).toBe(HttpCode.NOT_FOUND);
    });
  });

  describe(`COMMENTS: DELETE`, () => {
    let app;

    beforeAll(async () => {
      app = await createAPI();
    });

    test(`Status code 404 for no exists offer`, () => {
      return request(app)
        .delete(`/offers/13/comments/13`)
        .expect(HttpCode.NOT_FOUND);
    });

    test(`Status code 404 for no exists comment`, () => {
      return request(app)
        .delete(`/offers/1/comments/NOEXISTS`)
        .expect(HttpCode.NOT_FOUND);
    });
  });

});
