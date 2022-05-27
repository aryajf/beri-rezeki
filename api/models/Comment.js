'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    static associate(models) {
      Comment.belongsTo(models.User, {
        as: 'user',
        foreignKey: 'user_id'
      }),
      Comment.belongsTo(models.Program, {
        as: 'program',
        foreignKey: 'program_id'
      }),
      Comment.hasOne(models.Payment, {
        as: 'payment',
        foreignKey: 'kode'
      })
      Comment.hasMany(models.Like, {
        as: 'likes',
        foreignKey: 'comment_id'
      })
    }
  };
  Comment.init({
    kode: DataTypes.STRING,
    user_id: DataTypes.INTEGER,
    program_id: DataTypes.INTEGER,
    reply_kode: DataTypes.STRING,
    status: DataTypes.ENUM('Pending', 'Accepted'),
    role: DataTypes.ENUM('Admin', 'Member'),
    messages: DataTypes.TEXT,
    isAnonymous: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Comment',
  });
  return Comment;
};