"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Follow extends Model {
    static associate(models) {
      // define association here
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

    static async pressFollow(userId, analId) {
      try {
        const analFollow = await this.create({
          userId,
          analId,
        });
        const analFollows = await this.findAll({
          userId: userId,
          analId: analId,
        });
        return {
          userId: analLike.userId,
          analId: analLike.analId,
          followNum: analLikes.length,
        };
      } catch (err) {
        throw err;
      }
    }

    static async pressUnFollow(userId, analId) {
      try {
        const analUnFollow = await this.destory({
          where: { userId: userId, analId: analId },
        });
        const analUnFollows = await this.findAll({
          userId: userId,
          analId: analId,
        });
        return {
          userId: analUnFollow.userId,
          analId: analUnFollow.analId,
          likeNum: analUnFollows.length,
        };
      } catch (err) {
        throw err;
      }
    }
  }

  Follow.init(
    {},
    {
      sequelize,
      modelName: "Follow",
    }
  );
  return Follow;
};
