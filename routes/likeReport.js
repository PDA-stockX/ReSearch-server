var express = require("express");
var router = express.Router();

const { initModels } = require("../models/initModels");
const models = initModels();

/* GET home page. */
router.post("/likeReport", async function (req, res, next) {
  // console.log(req.body);
  const destoryResult = await models.Dislike.destroy(
{where: { userId: req.body.userId, analystId: req.body.analId },
})}
  );
  console.log(destoryResult);
  const reportLike = await models.Like.pressLike(
    req.body.userId,
    req.body.analId
  );
  res.json(reportLike);
});

router.post("/unFollowAnal", async function (req, res, next) {
  const reportLike = await models.Follow.pressUnFollow(
    req.body.userId,
    req.body.analId
  );
  res.json(reportLike);
});

module.exports = router;
