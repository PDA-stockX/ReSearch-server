"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class LikeFirm extends Model {
        static associate(models) {
            this.belongsTo(models.User, {
                as: "user",
                foreignKey: "userId",
                onDelete: "CASCADE",
            });
            this.belongsTo(models.Firm, {
                as: "firm",
                foreignKey: "firmId",
                onDelete: "CASCADE",
            });
        }
    }

    LikeFirm.init(
        {},
        {
            sequelize,
            modelName: "LikeFirm",
        }
    );
    return LikeFirm;
};
