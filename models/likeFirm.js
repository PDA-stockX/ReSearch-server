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

    static async pressLikeFirm(userId, firmId) {
      try {
        const likeFirm = await this.create({
          userId: userId,
          firmId: firmId,
        });
        const likeFirms = await this.findAll({
          firmId: firmId,
        });
        return {
          likeFirmNum: likeFirms.length,
        };
      } catch (err) {
        throw err;
      }
    }

    static async pressUnlikeFirm(userId, firmId) {
      try {
        const unFirmReport = await this.destroy({
          userId: userId,
          firmId: firmId,
        });
        const likeFirms = await this.findAll({
          firmId: firmId,
        });
        return {
          likeFirmNum: likeFirms.length,
        };
      } catch (err) {
        throw err;
      }
    }
  }

  LikeFirm.init({},
    {
      sequelize,
      modelName: "LikeFirm",
    }
  );
  return LikeFirm;
};
