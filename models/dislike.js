'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Dislike extends Model {
        static associate(models) {
            // define association here
            this.belongsTo(models.User, {
                as: 'user',
                foreignKey: 'userId',
                onDelete: 'CASCADE'
            });
            this.belongsTo(models.Report, {
                as: 'report',
                foreignKey: 'reportId',
                onDelete: 'CASCADE'
            });
        }
    }

    Dislike.init({}, {
        sequelize,
        modelName: 'Dislike',
    });
    return Dislike;
};