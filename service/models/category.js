'use strict';

const {DataTypes} = require(`sequelize`);
const Aliase = require(`./aliase`);

const Category = (sequelize) => {
  return sequelize.define(`Category`, {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: Aliase.CATEGORIES
  });
};

module.exports = Category;
