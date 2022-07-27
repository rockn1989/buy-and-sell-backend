'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);

module.exports = (app, categoryService) => {
  const route = new Router();

  app.use(`/categories`, route);

  route.get(`/`, async (req, res) => {
    const {count} = req.query;
    const categories = await categoryService.findAll(count);
    return res.status(HttpCode.OK).json(categories);
  });

  route.get(`/:id`, async (req, res) => {
    const {id} = req.params;
    const {limit, offset} = req.query;

    const [{count, offersByCategory}, category] = await Promise.all([
      categoryService.findPage({id, limit, offset}),
      categoryService.findOne(id)
    ]);

    return res.status(HttpCode.OK).json({count, offersByCategory, category});
  });
};
