'use strict';

const {Op} = require(`sequelize`);
const Aliase = require(`../models/aliase`);

class SearchService {
  constructor(sequelize) {
    this._Offer = sequelize.models.Offer;
  }

  async findAll(query) {

    try {
      const result = await this._Offer.findAll({
        include: [Aliase.CATEGORIES],
        where: {
          title: {
            [Op.substring]: query
          }
        },
        order: [
          [`createdAt`, `DESC`]
        ]
      });
      return result;
    } catch (err) {
      return false;
    }
  }
}

module.exports = SearchService;
