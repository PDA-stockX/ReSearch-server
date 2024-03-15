"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Dislike extends Model {
    static associate(models) {
      // define association here
      this.belongsTo(models.User, {
        as: "user",
        targetKey: "userId",
        foreignKey: "userId",
        onDelete: "CASCADE",
      });
      this.belongsTo(models.Report, {
        as: "report",
        targetKey: "reportId",
        foreignKey: "reportId",
        onDelete: "CASCADE",
      });
    }
    static async pressHateReport(userId, reportId) {
      try {
        const hateReport = await this.create({
          userId: userId,
          reportId: reportId,
        });
        const hateReports = await this.findAll({
          reportId: reportId,
        });
        return {
          likeReportNum: hateReports.length,
        };
      } catch (err) {
        throw err;
      }
    }

    static async pressUnhateReport(userId, reportId) {
      try {
        const hateReport = await this.destory({
          userId: userId,
          reportId: reportId,
        });
        const hateReports = await this.findAll({
          reportId: reportId,
        });
        return {
          likeReportNum: hateReports.length,
        };
      } catch (err) {
        throw err;
      }
    }
  }

  Dislike.init(
    {
      userId: DataTypes.INTEGER,
      reportId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Dislike",
    }
  );
  return Dislike;
};
