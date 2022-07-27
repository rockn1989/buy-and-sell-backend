'use strict';

const {DataTypes} = require(`sequelize`);
const Aliase = require(`./aliase`);

const Offer = (sequelize) => {
  return sequelize.define(`Offer`, {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    sum: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    description: {
      // eslint-disable-next-line new-cap
      type: DataTypes.STRING(1000),
      allowNull: false
    },
    picture: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: Aliase.OFFERS
  });
};

module.exports = Offer;
