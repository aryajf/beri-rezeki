'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Payment extends Model {
    static associate(models) {
      Payment.hasOne(models.Comment, {
        as: 'comment',
        foreignKey: 'kode'
      }),
      Payment.belongsTo(models.Program, {
        as: 'program',
        foreignKey: 'program_id'
      }),
      Payment.belongsTo(models.User, {
        as: 'user',
        foreignKey: 'user_id'
      })
    }
  };
  Payment.init({
    kode: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    user_id: DataTypes.INTEGER,
    program_id: DataTypes.INTEGER,
    total_harga: DataTypes.BIGINT,
    status: DataTypes.ENUM('Pending', 'Accepted'),
    expiredAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Payment',
  });
  return Payment;
};