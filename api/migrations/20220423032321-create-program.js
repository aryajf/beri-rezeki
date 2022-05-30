'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Programs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        allowNull: false,
        type: Sequelize.STRING
      },
      slug: {
        allowNull: false,
        type: Sequelize.STRING
      },
      short_desc: {
        allowNull: false,
        type: Sequelize.STRING
      },
      long_desc: {
        allowNull: false,
        type: Sequelize.TEXT('long')
      },
      cover: {
        allowNull: false,
        type: Sequelize.STRING
      },
      pdf_file: {
        allowNull: true,
        type: Sequelize.STRING
      },
      harga: {
        allowNull: false,
        type: Sequelize.BIGINT
      },
      type: {
        allowNull: false,
        type: Sequelize.ENUM('Single', 'Crowdfunding')
      },
      expiredAt: {
        allowNull: false,
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
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Programs');
  }
};