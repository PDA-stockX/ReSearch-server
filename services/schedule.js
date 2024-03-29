const { initModels } = require("../models/initModels");
const { fetchTodayReports } = require("../api/crawlApi");
const { calculateReturnRate, calculateAchievementScore } = require("./reports");
const { sendMail } = require("./mail");

const models = initModels();

// 오늘 리포트 저장
const saveTodayReports = async () => {
  try {
    const reports = await fetchTodayReports();
    return await models.Report.bulkCreate(reports);
  } catch (err) {
    console.error(err);
  }
};

// 리포트 업데이트 (수익률/달성률 계산)
const updateReport = async () => {
  try {
    const reports = await models.Report.findAll({
      where: {
        returnRate: null,
      },
      order: [["postedAt", "ASC"]],
    });

    const toUpdate = reports.filter((report) => report.postedAt <= reports[0].postedAt);
    for (const report of toUpdate) {
      report.returnRate = await calculateReturnRate(report.stockName, report.postedAt, report.refPrice);
      report.achievementScore = await calculateAchievementScore(report.stockName, report.postedAt, report.refPrice, report.targetPrice);
    }
    await models.Report.bulkCreate(toUpdate, {
      updateOnDuplicate: ["id"],
    });
  } catch (err) {
    console.error(err);
  }
};

// 애널리스트 업데이트 (수익률/달성률 계산)
const updateAnalyst = async () => {
  try {
    const analysts = await models.Analyst.findAll();

    for (const analyst of analysts) {
      const reports = await models.Report.findAll({
        where: {
          analystId: analyst.id,
        },
        attributes: ["returnRate", "achievementScore"],
      });

      const totalReturnRate = reports.reduce((sum, report) => sum + report.returnRate, 0);
      const totalAchievementScore = reports.reduce((sum, report) => sum + report.achievementScore, 0);
      const averageReturnRate = reports.length > 0 ? totalReturnRate / reports.length : 0;
      const averageAchievementScore = reports.length > 0 ? totalAchievementScore / reports.length : 0;

      await models.Analyst.update(
        {
          returnRate: averageReturnRate,
          achievementScore: averageAchievementScore,
        },
        {
          where: { id: analyst.id },
        }
      );
    }
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "fail" });
    next(err);
  }
};

const notifyUsersOfNewReports = async () => {
  try {
    await updateReport(); // 리포트 업데이트
    await updateAnalyst(); // 애널리스트 업데이트
    const todayReports = await saveTodayReports(); // 오늘 새로 나온 리포트 저장

    const analysts = todayReports.map((report) => report.analystId);
    const follows = await models.Follow.findAll({
      where: {
        analystId: analysts,
      },
    });

    const userWithAnalysts = follows.reduce((acc, follow) => {
      if (!acc[follow.userId]) {
        acc[follow.userId] = [];
      }
      acc[follow.userId].push(follow.analystId);
      return acc;
    }, {});

    // 사용자에게 알림
    for (const userId in userWithAnalysts) {
      const user = await models.User.findByPk(userId);
      const analysts = userWithAnalysts[userId];
      sendMail(user, analysts);
    }
  } catch (err) {
    console.error(err);
  }
};

module.exports = { notifyUserOfNewReports: notifyUsersOfNewReports };
