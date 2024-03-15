var express = require("express");
var router = express.Router();

const { initModels } = require("../models/initModels");
const models = initModels();

/* GET home page. */
router.post("/likeFirm", async function (req, res, next) {
  // console.log(req.body);
  const destoryResult = await models.LikeFirm.destroy({
    where: { usreId: req.body.userId, firmId: req.body.firmId },
  });
  console.log(destoryResult);
  const firmLike = await models.LikeReport.pressLikeFirm(
    req.body.userId,
    req.body.firmId
  );
  res.json(firmLike);
});

router.post("/unLikeReport", async function (req, res, next) {
  const firmLike = await models.LikeReport.pressUnlikeFirm(
    req.body.userId,
    req.body.firmId
  );
  res.json(firmLike);
});

module.exports = router;
