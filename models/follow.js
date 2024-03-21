"use strict";
const { Model } = require("sequelize");
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
        targetKey: "analystId",
        onDelete: "CASCADE",
      });
    }

    static async pressFollow(userId, analId) {
      console.log(userId + analId);
      try {
        const analFollow = await this.create({
          userId: userId,
          analystId: analId,
        });
        const analFollows = await this.findAll({
          where: {
            analystId: analId,
          },
        });

        return {
          // followNum: analFollows.length,
          followNum: analFollows.length,
        };
      } catch (err) {
        throw err;
      }
    }

    static async pressUnFollow(userId, analId) {
      try {
        console.log(userId + "analId : " + analId);
        await this.destroy({
          where: { userId: userId, analystId: analId },
        });
        const analUnFollows = await this.findAll({
          where: { analystId: analId },
        });
        return {
          followNum: analUnFollows.length,
        };
      } catch (err) {
        throw err;
      }
    }
  }

  Follow.init({},
    {
      sequelize,
      modelName: "Follow",
    }
  );
  return Follow;
};
