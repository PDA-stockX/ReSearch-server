'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {

    class StockItem extends Model {
        static associate(models) {
        }
    }

    StockItem.init({
        itemCode: DataTypes.STRING,
        itemName: DataTypes.STRING,
        market: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'StockItem',
    });
    return StockItem;
};