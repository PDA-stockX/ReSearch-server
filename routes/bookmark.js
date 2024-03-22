var express = require("express");
var router = express.Router();

const { initModels } = require("../models/initModels");
const models = initModels();
const { verifyToken, authenticate } = require("../services/auth");

router.use(authenticate);

router.get("/myAnal", async function (req, res, next) {
  // console.log(req);
  try {
    const myAnalList = await models.Follow.findAll({
      include: [{ model: models.Analyst, as: "analyst" }],
      where: { userId: req.user.id },
    });
    res.json(myAnalList);
  } catch (err) {
    throw err;
  }
  // res.json(myAnalList);
  // res.json({ message: "fail" });
});

router.get("/myReport", async function (req, res, next) {
  console.log(req.body);
  try {
    const myReportList = await models.LikeReport.findAll({
      include: [{ model: models.Report, as: "report" }],
      where: { userId: req.body.userId },
    });
  } catch (err) {
    throw err;
  }
});

module.exports = router;
