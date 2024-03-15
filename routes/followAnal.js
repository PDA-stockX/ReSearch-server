var express = require("express");
var router = express.Router();

const { initModels } = require("../models/initModels");
const models = initModels();

/* GET home page. */
router.post("/followAnal", async function (req, res, next) {
  // console.log(req.body);
  const analystList = await models.Follow.pressFollow(
    req.body.userId,
    req.body.analId
  );
  res.json(analystList);
});

router.post("/unFollowAnal", async function (req, res, next) {
  const analystList = await models.Follow.pressUnFollow(
    req.body.userId,
    req.body.analId
  );
  res.json(analystList);
});
router.get;

module.exports = router;
