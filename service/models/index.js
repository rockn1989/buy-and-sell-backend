'use strict';

const Aliase = require(`./aliase`);

const defineCategory = require(`./category`);
const defineRole = require(`./role`);
const defineUser = require(`./user`);
const defineOffer = require(`./offer`);
const defineComment = require(`./comment`);
const defineOfferCategories = require(`./offer-categories`);
const defineToken = require(`./token`);

const define = (sequelize) => {
  const Category = defineCategory(sequelize);
  const Role = defineRole(sequelize);
  const User = defineUser(sequelize);
  const Offer = defineOffer(sequelize);
  const Comment = defineComment(sequelize);
  const OfferCategories = defineOfferCategories(sequelize);
  const Token = defineToken(sequelize);

  User.hasMany(Offer, {
    as: Aliase.OFFERS,
    foreignKey: `userId`
  });

  Offer.belongsTo(User, {
    as: Aliase.USERS,
    foreignKey: `userId`
  });

  Offer.hasMany(Comment, {
    as: Aliase.COMMENTS,
    foreignKey: `offerId`,
    onDelete: `cascade`
  });

  Comment.belongsTo(Offer, {
    as: Aliase.OFFERS,
    foreignKey: `offerId`
  });

  Comment.belongsTo(User, {
    as: Aliase.USERS,
    foreignKey: `userId`
  });

  User.hasMany(Comment, {
    as: Aliase.COMMENTS,
    foreignKey: `userId`
  });

  Offer.belongsToMany(Category, {
    as: Aliase.CATEGORIES,
    through: OfferCategories,
  });

  Category.belongsToMany(Offer, {
    as: Aliase.OFFERS,
    through: OfferCategories,
  });

  Category.hasMany(OfferCategories, {
    as: Aliase.OFFER_CATEGORIES
  });

  Role.hasOne(User, {
    as: Aliase.USERS,
    foreignKey: `roleId`
  });

  User.belongsTo(Role, {
    as: Aliase.ROLES,
    foreignKey: `roleId`
  });

  return {
    Category,
    Role,
    User,
    Offer,
    Comment,
    OfferCategories,
    Token
  };
};

module.exports = define;
