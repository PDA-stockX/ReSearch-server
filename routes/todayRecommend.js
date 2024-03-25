const express = require("express");
const router = express.Router();
var Sequelize = require("sequelize");
const models = require("../models/index");
const { Op } = require("sequelize");
router.get("", async (req, res, next) => {
  const today1yearAgo = new Date();
  const today2yearAgo = new Date();
  const todayYear = today1yearAgo.getFullYear();
  //   const todayMonth = today.getMonth();
  today1yearAgo.setFullYear(todayYear - 1);
  today2yearAgo.setFullYear(todayYear - 2);
  //   today.setMonth(todayMonth - 1);
  const analystIdArr = [1, 45, 60];
  const analystArr = [];
  analystIdArr.forEach((e) => {
    analystArr.push({
      analId: e,
      achievementScore: 0,
      returnRate: 0,
      reportNum: 0,
      totalScore: 0,
    });
  });
  console.log(analystArr);
  const response = await models.Report.findAll({
    where: {
      postedAt: {
        [Op.and]: {
          //   [Op.gte]: today2yearAgo.toDateString(),
          //   [Op.lte]: today1yearAgo.toDateString(),
        },
      },
      analystId: {
        [Op.in]: analystIdArr,
      },
    },
  });
  console.log(response);
  response.forEach((e) => {
    console.log(e);
    analystArr.forEach((el) => {
      console.log(el);

      if (e.analystId == el.analId) {
        console.log(e);
        el.achievementScore += e.achievementScore;
        el.returnRate += e.returnRate;
        el.reportNum++;
      }
    });
  });
  analystArr.forEach((e) => {
    e.totalScore =
      e.achievementScore * 0.5 + e.returnRate * 0.3 + Math.min(e.reportNum, 20);
  });
  analystArr.sort(function (a, b) {
    return b.totalScore - a.totalScore;
  });
  console.log(analystArr);
});

module.exports = router;
