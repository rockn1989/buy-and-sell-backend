'use strict';

const {HttpCode} = require(`../../constants`);

class CommentService {
  constructor(sequelize) {
    this._Offer = sequelize.models.Offer;
    this._Comment = sequelize.models.Comment;
  }

  async findAll(offerId) {
    return this._Comment.findAll({
      where: {offerId},
      raw: true
    });
  }

  async findOne(offerId, commentId) {
    const comment = await this._Comment.findOne({
      where: {
        id: commentId,
        offerId
      },
      raw: true
    });

    return comment;
  }

  async drop(offerId, commentId, user) {

    try {
      let offerByUser;

      if (user.roleId === 3) {
        offerByUser = await this._Offer.findOne({
          where: {
            id: offerId,
          }
        });
      } else {
        offerByUser = await this._Offer.findOne({
          where: {
            id: offerId,
            userId: user.id
          }
        });
      }

      if (!offerByUser) {
        return {
          status: HttpCode.UNAUTHORIZED,
          statusText: `You cant deleting comment`
        };
      }

      const commentRow = await this._Comment.destroy({
        where: {
          id: commentId
        }
      });

      return {
        status: commentRow === 1 ? HttpCode.DELETED : HttpCode.NOT_FOUND,
        statusText: commentRow === 1 ? `deleted` : `No comment`
      };
    } catch (err) {
      return false;
    }
  }

  async create(offerId, comment) {
    try {
      const commentRow = await this._Comment.create({offerId, ...comment});
      return commentRow;
    } catch (err) {
      return false;
    }
  }
}


module.exports = CommentService;
