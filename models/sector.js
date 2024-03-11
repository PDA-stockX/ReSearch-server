'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Sector extends Model {
        static associate(models) {
            // define association here
        }
    }

    Sector.init({
        name: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'Sector',
    });
    return Sector;
};