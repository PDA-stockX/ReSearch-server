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
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
