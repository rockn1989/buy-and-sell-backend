'use strict';

const {DataTypes} = require(`sequelize`);
const Aliase = require(`./aliase`);

const User = (sequelize) => {
  return sequelize.define(`User`, {
    firstname: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: false
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: Aliase.USERS
  });
};

module.exports = User;
