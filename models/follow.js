"use strict";
const {Model} = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Follow extends Model {
        static associate(models) {
            this.belongsTo(models.User, {
                as: "user",
                foreignKey: "userId",
                onDelete: "CASCADE",
            });
            this.belongsTo(models.Analyst, {
                as: "analyst",
                foreignKey: "analystId",
                onDelete: "CASCADE",
            });
        }
    }

    Follow.init(
        {
            userId: DataTypes.INTEGER,
            analystId: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: "Follow",
        }
    );
    return Follow;
};
