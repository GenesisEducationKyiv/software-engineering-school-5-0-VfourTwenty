'use strict';
module.exports = (sequelize, DataTypes) => {
    const WeatherCity = sequelize.define('WeatherCity', {
        city: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        hourly_count: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        daily_count: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        }
    }, {
        tableName: 'WeatherCity',
        timestamps: false
    });

    return WeatherCity;
};
