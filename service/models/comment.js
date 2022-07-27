'use strict';

const {DataTypes} = require(`sequelize`);
const Aliase = require(`./aliase`);

const Comment = (sequelize) => {
  return sequelize.define(`Comment`, {
    text: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: Aliase.COMMENTS
  });
};

module.exports = Comment;
