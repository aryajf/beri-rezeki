'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Like, {
        as: 'likes',
        foreignKey: 'user_id'
      })
    }
  };
  User.init({
    email: DataTypes.STRING,
    nama: DataTypes.STRING,
    password: DataTypes.STRING,
    no_telp: DataTypes.STRING,
    avatar: DataTypes.STRING,
    role: DataTypes.ENUM('Admin', 'Member'),
    email_status: DataTypes.ENUM('Unverified', 'Verified'),
    email_verified_at: DataTypes.DATE,
    token: DataTypes.STRING,
    token_expired_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};