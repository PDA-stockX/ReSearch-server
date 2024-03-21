"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class DislikeFirm extends Model {
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
    static async pressHateFirm(userId, firmId) {
      try {
        const hateFirm = await this.create({
          userId: userId,
          firmId: firmId,
        });
        const hateFirms = await this.findAll({
          firmId: firmId,
        });
        return {
          hateFirms: hateFirms.length,
        };
      } catch (err) {
        throw err;
      }
    }

    static async pressUnhateReport(userId, firmId) {
      try {
        const unHateReport = await this.destroy({
          userId: userId,
          firmId: firmId,
        });
        const hateReports = await this.findAll({
          firmId: firmId,
        });
        return {
          hateReportNum: hateReports.length,
        };
      } catch (err) {
        throw err;
      }
    }
  }

  DislikeFirm.init(
    {
      userId: DataTypes.INTEGER,
      firmId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "DislikeFirm",
    }
  );
  return DislikeFirm;
};
