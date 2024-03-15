'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class DislikeReport extends Model {
        static associate(models) {
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

    DislikeReport.init({}, {
        sequelize,
        modelName: 'DislikeReport',
    });
    return DislikeReport;
};