'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('WeatherCity', {
      city: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
      },
      hourly_count: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      daily_count: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('WeatherCity');
  }
};
