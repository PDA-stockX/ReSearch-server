const express = require("express");
const router = express.Router();
var Sequelize = require("sequelize");
const models = require("../models/index");
const { Op } = require("sequelize");
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

module.exports = router;
