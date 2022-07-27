'use strict';

const {DataTypes} = require(`sequelize`);
const Aliase = require(`./aliase`);

const Token = (sequelize) => {
  return sequelize.define(`Token`, {
    refresh: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  }, {
    tableName: Aliase.TOKEN
  });
};

module.exports = Token;
