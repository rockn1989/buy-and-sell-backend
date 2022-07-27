'use strict';

const {DataTypes} = require(`sequelize`);
const Aliase = require(`./aliase`);

const Role = (sequelize) => {
  return sequelize.define(`Role`, {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: Aliase.ROLES
  });
};

module.exports = Role;
