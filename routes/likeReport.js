var express = require("express");
var router = express.Router();

const { initModels } = require("../models/initModels");
const models = initModels();

/* GET home page. */
router.post("/likeReport", async function (req, res, next) {
  // console.log(req.body);
  const destoryResult = await models.DislikeReport.destroy({
    where: { usreId: req.body.userId, reportId: req.body.reportId },
  });
  console.log(destoryResult);
  const reportLike = await models.LikeReport.pressLikeReport(
    req.body.userId,
    req.body.reportId
  );
  res.json(reportLike);
});

router.post("/unLikeReport", async function (req, res, next) {
  const reportLike = await models.LikeReport.pressUnlikeReport(
    req.body.userId,
    req.body.reportId
  );
  res.json(reportLike);
});

module.exports = router;
