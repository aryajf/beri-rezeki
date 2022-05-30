'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Program extends Model {
    static associate(models) {
      Program.hasMany(models.Payment, {
        as: 'payments',
        foreignKey: 'program_id'
      })
      Program.hasMany(models.Comment, {
        as: 'comments',
        foreignKey: 'program_id'
      })
    }
  }
  Program.init({
    title: DataTypes.STRING,
    slug: DataTypes.STRING,
    short_desc: DataTypes.STRING,
    long_desc: DataTypes.TEXT('long'),
    cover: DataTypes.STRING,
    pdf_file: DataTypes.STRING,
    harga: DataTypes.BIGINT,
    type: DataTypes.ENUM('Single', 'Crowdfunding'),
    expiredAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Program',
  });
  return Program;
};