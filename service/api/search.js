'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);

module.exports = (app, searchService) => {
  const route = new Router();
  app.use(`/search`, route);

  route.get(`/`, async (req, res) => {
    const {query} = req.query;

    if (!query) {
      return res.status(HttpCode.BAD_REQUEST).send(`Bad request`);
    }

    const result = await searchService.findAll(query);

    if (result.length === 0) {
      return res.status(HttpCode.NOT_FOUND).send(`not found`);
    }

    return res.status(HttpCode.OK).json(result);
  });
};
