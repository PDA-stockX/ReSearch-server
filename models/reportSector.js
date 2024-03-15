'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class ReportSector extends Model {
        static associate(models) {
            this.belongsTo(models.Report, {
                as: 'report',
                foreignKey: 'reportId',
                onDelete: 'CASCADE'
            });
        }
    }

    ReportSector.init({
        sectorName: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'ReportSector',
    });
    return ReportSector;
};