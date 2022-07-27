'use strict';

const Sequelize = require(`sequelize`);
const Aliase = require(`../models/aliase`);

class CategoryService {
  constructor(sequelize) {
    this._Category = sequelize.models.Category;
    this._Offer = sequelize.models.Offer;
    this._OfferCategories = sequelize.models.OfferCategories;
  }

  async findAll(withCount) {
    if (withCount) {
      const categories = await this._Category.findAll({
        attributes: [
          `name`,
          `id`,
          [
            Sequelize.fn(`COUNT`, Sequelize.col(`CategoryId`)),
            `count`
          ]
        ],
        group: [Sequelize.col(`Category.id`)],
        include: [{
          model: this._OfferCategories,
          as: Aliase.OFFER_CATEGORIES,
          attributes: []
        }],
      });

      return categories.map((item) => item.get());
    } else {
      return await this._Category.findAll({raw: true});
    }
  }

  async findOne(categoryId) {
    return this._Category.findByPk(categoryId, {raw: true});
  }

  async findPage({id, limit, offset}) {
    const offerIdByCategory = await this._OfferCategories.findAll({
      attributes: [`OfferId`],
      where: {
        CategoryId: id
      },
      raw: true
    });

    const offersId = offerIdByCategory.map((item) => item.OfferId);

    const {count, rows} = await this._Offer.findAndCountAll({
      limit,
      offset,
      include: [
        Aliase.CATEGORIES,
        Aliase.COMMENTS
      ],
      where: {
        id: offersId
      },
      distinct: true,
      order: [
        [`createdAt`, `DESC`]
      ]
    });

    return {count, offersByCategory: rows};

  }
}

module.exports = CategoryService;
