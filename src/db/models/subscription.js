'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => 
{
    class Subscription extends Model 
    {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    }
    Subscription.init({
        email: DataTypes.STRING,
        city: DataTypes.STRING,
        frequency: DataTypes.STRING,
        confirmed: DataTypes.BOOLEAN,
        token: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'Subscription',
    });
    return Subscription;
};
