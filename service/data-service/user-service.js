'use strict';

class User {
  constructor(sequelize) {
    this._User = sequelize.models.User;
  }

  async create(userData) {
    let user;

    try {
      user = await this._User.create(userData);
      await user.setRoles(1);
    } catch (err) {
      return false;
    }

    const newUser = {...user.get()};
    delete newUser.passwordHash;

    return newUser;
  }

  async findByEmail(email) {
    let userExists;
    try {
      userExists = await this._User.findOne({
        where: {
          email
        },
        raw: true
      });
    } catch (error) {
      return false;
    }

    return userExists;
  }
}

module.exports = User;
