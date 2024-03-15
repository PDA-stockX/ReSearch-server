var express = require("express");
var router = express.Router();

const { initModels } = require("../models/initModels");
const models = initModels();

/* GET home page. */
router.post("/hateReport", async function (req, res, next) {
  // console.log(req.body);
  const destoryResult = await models.LikeReport.destroy({
    where: { userId: req.body.userId, analystId: req.body.reportId },
  });
  const analystList = await models.DislikeReport.pressHateReport(
    req.body.userId,
    req.body.reportId
  );
  res.json(analystList);
});

router.post("/unHateReport", async function (req, res, next) {
  const analystList = await models.DislikeReport.pressUnhateReport(
    req.body.userId,
    req.body.reportId
  );
  res.json(analystList);
});

module.exports = router;
