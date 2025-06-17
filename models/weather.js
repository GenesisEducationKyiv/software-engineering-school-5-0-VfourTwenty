'use strict';
module.exports = (sequelize, DataTypes) => 
{
    const WeatherData = sequelize.define('WeatherData', {
        city: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        temperature: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        humidity: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        fetchedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    }, {
        tableName: 'WeatherData',
        timestamps: false
    });

    return WeatherData;
};
