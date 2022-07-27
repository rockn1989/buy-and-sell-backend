'use strict';

const OfferCategories = (sequelize) => {
  return sequelize.define(`OfferCategories`, {}, {
    sequelize,
    tableName: `offer_categories`
  });
};

module.exports = OfferCategories;
