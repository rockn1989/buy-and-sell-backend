'use strict';

class TokenService {
  constructor(sequelize) {
    this._Token = sequelize.models.Token;
  }

  async add(refreshToken) {

    try {
      const token = await this._Token.create({refresh: refreshToken});
      return token.get();
    } catch (error) {
      return false;
    }
  }

  async find(refreshToken) {
    try {
      const token = await this._Token.findOne({
        where: {
          refresh: refreshToken
        }
      });

      return token;
    } catch (error) {
      return false;
    }
  }

  async delete(refreshToken) {
    try {
      const token = await this._Token.destroy({
        where: {
          refresh: refreshToken.refresh
        }
      });

      return Boolean(token);
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}

module.exports = TokenService;
