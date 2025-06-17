'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => 
    {
        await queryInterface.createTable('WeatherData', {
            city: {
                type: Sequelize.STRING,
                allowNull: false,
                primaryKey: true
            },
            temperature: {
                type: Sequelize.FLOAT,
                allowNull: false
            },
            humidity: {
                type: Sequelize.FLOAT,
                allowNull: false
            },
            description: {
                type: Sequelize.STRING,
                allowNull: false
            },
            fetchedAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            }
        });
    },

    down: async (queryInterface) => 
    {
        await queryInterface.dropTable('WeatherData');
    }
};
