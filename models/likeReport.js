"use strict";
const {Model} = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class LikeReport extends Model {
        static associate(models) {
            this.belongsTo(models.User, {
                as: "user",
                foreignKey: "userId",
                onDelete: "CASCADE",
            });
            this.belongsTo(models.Report, {
                as: "report",
                foreignKey: "reportId",
                onDelete: "CASCADE",
            });
        }
    }

    LikeReport.init(
        {},
        {
            sequelize,
            modelName: "LikeReport",
        }
    );
    return LikeReport;
};
