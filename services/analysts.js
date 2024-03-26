var Sequelize = require("sequelize");
const models = require("../models/index");
const { Op } = require("sequelize");
const getRankings = async (analystIdArr) => {
  // console.log(analystIdArr);
  const today1yearAgo = new Date();
  const today2yearAgo = new Date();
  const todayYear = today1yearAgo.getFullYear();
  //   const todayMonth = today.getMonth();
  today1yearAgo.setFullYear(todayYear - 1);
  today2yearAgo.setFullYear(todayYear - 2);
  //   today.setMonth(todayMonth - 1);
  const analystArr = [];
  analystIdArr.forEach((e) => {
    analystArr.push({
      analId: e,
      achievementScore: 0,
      returnRate: 0,
      reportNum: 0,
      totalScore: 0,
      firm: "",
    });
  });
  //   console.log(analystArr);
  try {
    const response = await models.Report.findAll({
      // attributes: [
      //   "achievementScore",
      //   "returnRate",
      //   "postedAt",
      //   "analystId",
      //   "firmId",
      // ],
      include: [{ model: models.Firm, as: "firm" }],
      where: {
        [Op.and]: [
          { analystId: analystIdArr },
          // { postedAt: { [Op.gte]: today2yearAgo.toDateString() } },
          // { postedAt: { [Op.lte]: today1yearAgo.toDateString() } },
        ],
      },
    });
    // console.log(response);
    response.forEach((e) => {
      // console.log(e);
      analystArr.forEach((el) => {
        // console.log(el);
        if (e.analystId == el.analId) {
          el.achievementScore += e.achievementScore;
          el.returnRate += e.returnRate;
          el.reportNum++;
          el.firm = e.firm.dataValues.name;
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
    // console.log(analystArr);
    return analystArr;
  } catch (err) {
    console.error(err);
  }
  // console.log("아리리리리링나뭏피ㅏㅠㄹㅁ야ㅏㅣ 푸쟈ㅣㅐㅁ누ㅠㅕㅓㅏ딘,");
  //   console.log(response);
};
module.exports = { getRankings };
