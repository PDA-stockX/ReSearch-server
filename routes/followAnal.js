var express = require("express");
var router = express.Router();

const { initModels } = require("../models/initModels");
const models = initModels();
const { verifyToken, authenticate } = require("../services/auth");

router.get("/checkFollow", async function (req, res, next) {
  console.log(req.query);
  const checkAnalyst = await models.Follow.findOne({
    where: {
      userId: req.query.userId,
      analystId: req.query.analId,
    },
  });
  console.log("checkAnal = " + checkAnalyst);
  if (checkAnalyst == null) {
    res.json({ message: "No" });
  } else {
    res.json({ message: "Yes" });
  }
  // if (cehckAnalyst) res.json({ message: "Yes" });
  // else
});
router.use(authenticate);
/* GET home page. */
router.post("/followAnal", async function (req, res, next) {
  // console.log(req);
  try {
    console.log(req.user.id);
    console.log(req.body.analId);
    const analystList = await models.Follow.create({
      userId: req.user.id,
      analystId: req.body.analId,
    });
    console.log(analystList);
    // res.json(analystList);
    res.json({ message: "success" });
  } catch (err) {
    console.log(err);
    throw err;
  }
});
router.post("/unFollowAnal", async function (req, res, next) {
  // console.log(req);
  const analystList = await models.Follow.destroy({
    where: { userId: req.user.id, analystId: req.body.analId },
  });
  // res.json(analystList);
  res.json({ message: "success" });
});
module.exports = router;
