'use strict';

const {Sequelize} = require(`sequelize`);
const Aliase = require(`../models/aliase`);

const {OFFERS_PER_PAGE, HttpCode} = require(`../../constants`);

class OfferService {
  constructor(sequelize) {
    this._Offer = sequelize.models.Offer;
    this._Category = sequelize.models.Category;
    this._User = sequelize.models.User;
    this._Comment = sequelize.models.Comment;
  }

  async findPage({limit, offset}) {

    const options = {
      limit,
      offset,
      distinct: true,
      include: [{
        model: this._Category,
        as: Aliase.CATEGORIES
      }],
      order: [
        [`createdAt`, `DESC`]
      ]
    };

    const {count, rows} = await this._Offer.findAndCountAll(options);

    return {offers: rows, count};
  }

  async findAll({comments, id, roleId}) {

    const options = {
      include: [{
        model: this._Category,
        as: Aliase.CATEGORIES
      }],
      order: [
        [`createdAt`, `DESC`]
      ],
    };

    if (comments) {
      options.include.push({
        model: this._Comment,
        as: Aliase.COMMENTS,
        include: [{
          model: this._User,
          as: Aliase.USERS,
          attributes: {
            exclude: [`passwordHash`]
          }
        }]
      });
      options.order = [
        [Aliase.COMMENTS, `createdAt`, `DESC`]
      ];
    }

    if (id && roleId === 2) {
      options.where = {
        userId: id
      };
    }

    const offers = await this._Offer.findAll(options);

    return offers.map((item) => item.get());
  }

  async findOne({offerId, comments}) {

    const options = {
      include: [
        Aliase.CATEGORIES, {
          model: this._User,
          as: Aliase.USERS,
          attributes: {
            exclude: [`passwordHash`]
          }
        }
      ]
    };

    if (comments) {
      options.include.push({
        model: this._Comment,
        as: Aliase.COMMENTS,
        include: [{
          model: this._User,
          as: Aliase.USERS,
          attributes: {
            exclude: [`passwordHash`]
          }
        }]
      });
      options.order = [
        [Aliase.COMMENTS, `createdAt`, `DESC`]
      ];
    }

    let offer;

    try {
      offer = await this._Offer.findByPk(offerId, options);
    } catch (err) {
      return false;
    }

    if (!offer) {
      return !!offer;
    }

    return offer;
  }

  async findUserOffers(userId) {

    const comments = await this._Offer.findAll({
      include: [{
        model: this._Comment,
        as: Aliase.COMMENTS,
        include: [{
          model: this._User,
          as: Aliase.USERS,
          attributes: {
            exclude: [`passwordHash`]
          }
        }],
        where: {
          userId
        }
      }],
    });

    return comments;
  }

  async findTopOffers() {

    let offers;

    const options = {
      attributes: {
        include: [
          [Sequelize.fn(`COUNT`, Sequelize.col(`comments.id`)), `commentsCount`]
        ]
      },
      include: [
        {
          model: this._Comment,
          as: Aliase.COMMENTS,
          attributes: []
        },
        {
          model: this._Category,
          as: Aliase.CATEGORIES,
          attributes: [`id`, `name`]
        }
      ],
      group: [
        `Offer.id`,
        `categories.id`,
        `categories->OfferCategories`,
        `categories->OfferCategories.OfferId`,
        `categories->OfferCategories.CategoryId`
      ],
      order: [
        [Sequelize.fn(`COUNT`, Sequelize.col(`comments.id`)), `DESC`]
      ]
    };

    try {
      offers = await this._Offer.findAll(options);
    } catch (err) {
      return false;
    }

    return offers.map((item) => item.get()).filter((item) => item.commentsCount > 0).slice(0, OFFERS_PER_PAGE);
  }

  async create(offer) {
    const newOffer = await this._Offer.create({...offer, userId: 3});

    try {
      await newOffer.addCategories(offer.category);
    } catch (err) {
      return err.message;
    }

    return newOffer;
  }

  async drop(id) {
    let offerId;

    try {
      offerId = await this._Offer.destroy({
        where: {id}
      });

    } catch (err) {
      return false;
    }

    if (!offerId) {
      return !!offerId;
    }

    return offerId;
  }

  async update(offerId, userId, offerData) {
    let affectedRow;
    let updateOffer;

    try {
      [affectedRow] = await this._Offer.update(offerData, {
        where: {
          id: offerId,
          userId
        }
      });


      if (!affectedRow) {
        return {
          status: HttpCode.UNAUTHORIZED,
          statusText: `You cant edit offer`,
          errorStatus: !!affectedRow
        };
      }

    } catch (err) {
      return false;
    }

    try {
      updateOffer = await this._Offer.findOne({
        where: {id: offerId}
      });

      await updateOffer.setCategories(offerData.category);
    } catch (err) {
      return {
        status: HttpCode.FORBIDDEN,
        statusText: `Something wrong...`,
        errorStatus: false
      };
    }

    return {
      status: HttpCode.OK,
      statusText: `update`,
      errorStatus: true
    };
  }
}


module.exports = OfferService;
