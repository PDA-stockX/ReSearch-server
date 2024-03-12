"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Like extends Model {
    static associate(models) {
      // define association here
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

    static async pressLike(userId, analId) {
      try {
        const analLike = await this.create({
          userId,
          analId,
        });
        const analLikes = await this.findAll({
          userId: userId,
          analId: analId,
        });
        return {
          userId: analLike.userId,
          analId: analLike.analId,
          likeNum: analLikes.length,
        };
      } catch (err) {
        throw err;
      }
    }

    static async pressUnLike(userId, analId) {
      try {
        const analUnLike = await this.destory({
          where: { userId: userId, analId: analId },
        });
        const analLikes = await this.findAll({
          userId: userId,
          analId: analId,
        });
        return {
          userId: analUnLike.userId,
          analId: analUnLike.analId,
          likeNum: analLikes.length,
        };
      } catch (err) {
        throw err;
      }
    }
  }

  Like.init(
    {},
    {
      sequelize,
      modelName: "Like",
    }
  );
  return Like;
};
