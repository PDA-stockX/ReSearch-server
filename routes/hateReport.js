var express = require("express");
var router = express.Router();

const { initModels } = require("../models/initModels");
const models = initModels();
const { verifyToken } = require("../services/auth");
/* GET home page. */
router.post("/hateReport", async function (req, res, next) {
  // console.log(req.body);
  const token = req.cookies["authToken"];

  const ValidToken = verifyToken(token);
  if (ValidToken) {
    const destoryResult = await models.LikeReport.destroy({
      where: { userId: req.body.userId, analystId: req.body.reportId },
    });
    const analystList = await models.DislikeReport.pressHateReport(
      req.body.userId,
      req.body.reportId
    );
    res.json(analystList);
  } else {
    res.json({ message: "fail" });
  }
});

router.post("/unHateReport", async function (req, res, next) {
  const token = req.cookies["authToken"];

  const ValidToken = verifyToken(token);
  if (ValidToken) {
    const analystList = await models.DislikeReport.pressUnhateReport(
      req.body.userId,
      req.body.reportId
    );
    res.json(analystList);
  } else {
    res.json({ message: "fail" });
  }
});

module.exports = router;
