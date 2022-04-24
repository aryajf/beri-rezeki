'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Comments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      kode: {
        allowNull: false,
        type: Sequelize.STRING
      },
      user_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      produk_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      reply_kode: {
        allowNull: true,
        type: Sequelize.STRING
      },
      status:{
        allowNull: false,
        type: Sequelize.ENUM('Pending', 'Accepted'),
      },
      role: {
        allowNull: false,
        type: Sequelize.ENUM('Admin', 'Member'),
        defaultValue: 'Member'
      },
      messages: {
        type: Sequelize.TEXT
      },
      isAnonymous: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Comments');
  }
};