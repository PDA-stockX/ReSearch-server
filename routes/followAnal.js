var express = require("express");
var router = express.Router();

const { initModels } = require("../models/initModels");
const models = initModels();
const { verifyToken } = require("../services/auth");
/* GET home page. */
router.post("/followAnal", async function (req, res, next) {
  // console.log(req.body);
  const token = req.cookies["authToken"];

  const ValidToken = verifyToken(token);
  if (ValidToken) {
    const analystList = await models.Follow.pressFollow(
      req.body.userId,
      req.body.analId
    );
    res.json(analystList);
  } else {
    res.json({ message: "fail" });
  }
});

router.post("/unFollowAnal", async function (req, res, next) {
  const token = req.cookies["authToken"];

  const ValidToken = verifyToken(token);
  if (ValidToken) {
    const analystList = await models.Follow.pressUnFollow(
      req.body.userId,
      req.body.analId
    );
    res.json(analystList);
  } else {
    res.json({ message: "fail" });
  }
});
router.get;

module.exports = router;
