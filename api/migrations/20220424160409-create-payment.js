'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Payments', {
      kode: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      user_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      program_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      total_harga: {
        allowNull: false,
        type: Sequelize.BIGINT
      },
      status: {
        allowNull: false,
        type: Sequelize.ENUM('Pending', 'Accepted'),
        defaultValue: 'Pending'
      },
      expiredAt: {
        allowNull: true,
        type: Sequelize.DATE
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
    await queryInterface.dropTable('Payments');
  }
};