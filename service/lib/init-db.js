'use strict';

const defineModels = require(`../models`);
const Aliase = require(`../models/aliase`);

module.exports = async (sequelize, {posts, categories, users, roles}) => {
  const {Category, User, Role, Offer} = defineModels(sequelize);

  defineModels(sequelize);
  await sequelize.sync({force: true});

  const catName = categories.map((it) => ({name: it}));
  const rolesName = roles.map((it) => ({name: it}));

  try {
    const categoryModels = await Category.bulkCreate(catName);

    const categoryById = categoryModels.reduce((it, acc) => {
      return {
        [acc.name]: acc.id,
        ...it
      };
    }, {});

    await Role.bulkCreate(rolesName);

    const userPromise = users.map(async (user) => {
      await User.create(user, {include: [Aliase.COMMENTS, Aliase.OFFERS, Aliase.ROLES]});
    });

    const offerPromise = posts.map(async (offer) => {
      const offerModel = await Offer.create(offer, {include: [Aliase.COMMENTS, Aliase.USERS]});
      await offerModel.addCategories(
          offer.categories.map((name) => categoryById[name])
      );
    });

    await Promise.all([userPromise, offerPromise]);

  } catch (err) {
    console.log(err);
  }

};
