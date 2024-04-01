const models = require("../models/index");
const { Op } = require("sequelize");

const getRankings = async (analystIdArr) => {
  const today1yearAgo = new Date();
  const today2yearAgo = new Date();
  const todayYear = today1yearAgo.getFullYear();
  today1yearAgo.setFullYear(todayYear - 1);
  today2yearAgo.setFullYear(todayYear - 2);

  const analystArr = [];
  analystIdArr.forEach((e) => {
    analystArr.push({
      analId: e,
      achievementScore: 0,
      returnRate: 0,
      reportNum: 0,
      totalScore: 0,
      firm: "",
      analystName: "",
    });
  });

  try {
    const response = await models.Report.findAll({
      include: [
        { model: models.Firm, as: "firm" },
        { model: models.Analyst, as: "analyst" },
      ],
      where: {
        [Op.and]: [
          { analystId: analystIdArr },
        ],
      },
    });

    response.forEach((e) => {
      analystArr.forEach((el) => {
        if (e.analystId === el.analId) {
          el.achievementScore += e.achievementScore;
          el.returnRate += e.returnRate;
          el.reportNum++;
          el.firm = e.firm.dataValues.name;
          el.analystName = e.analyst.dataValues.name;
        }
      });
    });
    analystArr.forEach((e) => {
      e.totalScore =
        e.achievementScore * 0.5 +
        e.returnRate * 0.3 +
        Math.min(e.reportNum, 20);
    });
    analystArr.sort(function (a, b) {
      return b.totalScore - a.totalScore;
    });

    return analystArr;
  } catch (err) {
    console.error(err);
  }
};

module.exports = { getRankings };
