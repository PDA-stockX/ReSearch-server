const express = require("express");
const router = express.Router();

const { getRankings } = require("../services/analysts");

router.get("/getRecommend", async (req, res, next) => {
  try {
    //임시 오늘 리포트 애널리스트
    const analystIdArr = [3, 59, 107];
    const response = await getRankings(analystIdArr);
    console.log(response);

    res.json(response);
  } catch (err) {
    console.error(err);
  }
});

router.get("/getTodayReport", async (req, res, next) => {
  try {
    const reportArr = [1, 5, 7, 3];
    const response = await models.Report.findAll({
      include: { model: models.Firm, as: "firm" },
      where: { id: reportArr },
    });
    console.log(response[0].dataValues);
    const resList = [];
    response.forEach((el) => {
      resList.push({
        id: el.dataValues.id,
        stockName: el.dataValues.stockName,
        title: el.dataValues.title,
        firm: el.dataValues.firm.dataValues.name,
        postedAt: el.dataValues.postedAt,
      });
    });
    res.json(resList);
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
