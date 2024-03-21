var express = require("express");
var router = express.Router();

const { initModels } = require("../models/initModels");
const models = initModels();
const { verifyToken } = require("../services/auth");
router.get("/myAnal", async function (req, res, next) {
  const token = req.cookies["authToken"];

  const ValidToken = verifyToken(token);
  try {
    if (ValidToken) {
      console.log(req.body);
      const myAnalList = await models.Follow.findAll({
        where: { userId: req.body.userId },
      });
      res.json(myAnalList);
    } else {
      res.json({ message: "fail" });
    }
  } catch (err) {
    throw err;
  }
});

router.get("/myReport", async function (req, res, next) {
  const token = req.cookies["authToken"];

  const ValidToken = verifyToken(token);
  try {
    if (ValidToken) {
      console.log(req.body);
      const myReportList = await models.LikeReport.findAll({
        where: { userId: req.body.userId },
      });
      res.json(myReportList);
    } else {
      res.json({ message: "fail" });
    }
  } catch (err) {
    throw err;
  }
});

module.exports = router;
