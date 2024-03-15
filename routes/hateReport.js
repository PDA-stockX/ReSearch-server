var express = require("express");
var router = express.Router();

const { initModels } = require("../models/initModels");
const models = initModels();

/* GET home page. */
router.post("/hateReport", async function (req, res, next) {
  // console.log(req.body);
  const destoryResult = await models.Like.destroy({
    where: { userId: req.body.userId, analystId: req.body.analId },
  });
  const analystList = await models.Dislike.pressHateReport(
    req.body.userId,
    req.body.analId
  );
  res.json(analystList);
});

router.post("/unFollowAnal", async function (req, res, next) {
  const analystList = await models.Dislike.pressUnhateReport(
    req.body.userId,
    req.body.analId
  );
  res.json(analystList);
});

module.exports = router;
