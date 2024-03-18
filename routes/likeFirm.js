var express = require("express");
var router = express.Router();

const { initModels } = require("../models/initModels");
const models = initModels();
const { verifyToken } = require("../services/auth");

/* GET home page. */
router.post("/likeFirm", async function (req, res, next) {
  // console.log(req.body);
  const token = req.cookies["authToken"];

  const ValidToken = verifyToken(token);
  if (ValidToken) {
    const destoryResult = await models.LikeFirm.destroy({
      where: { usreId: req.body.userId, firmId: req.body.firmId },
    });
    console.log(destoryResult);
    const firmLike = await models.LikeFirm.pressLikeFirm(
      req.body.userId,
      req.body.firmId
    );
    res.json({ message: "success" });
  } else {
    res.json({ message: "fail" });
  }
});

router.post("/unLikeFirm", async function (req, res, next) {
  const token = req.cookies["authToken"];

  const ValidToken = verifyToken(token);
  if (ValidToken) {
    const firmLike = await models.LikeFirm.pressUnlikeFirm(
      req.body.userId,
      req.body.firmId
    );
    res.json({ message: "success" });
  } else {
    res.json({ message: "fail" });
  }
});

module.exports = router;
