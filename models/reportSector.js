'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class ReportSector extends Model {
        static associate(models) {
            // define association here
            this.belongsTo(models.Report, {
                as: 'report',
                foreignKey: 'reportId',
                onDelete: 'CASCADE'
            });
            this.belongsTo(models.Sector, {
                as: 'sector',
                foreignKey: 'sectorId',
                onDelete: 'CASCADE'
            });
        }
    }

    ReportSector.init({}, {
        sequelize,
        modelName: 'ReportSector',
    });
    return ReportSector;
};