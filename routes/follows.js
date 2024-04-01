const express = require("express");
const router = express.Router();

const models = require("../models/index");
const { verifyToken, authenticate } = require("../services/auth");

router.get("/my", async function (req, res, next) {
  const checkAnalyst = await models.Follow.findOne({
    where: {
      userId: req.query.userId,
      analystId: req.query.analId,
    },
  });
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
router.post("/follows", async function (req, res, next) {
  // console.log(req);
  try {
    const analystList = await models.Follow.create({
      userId: req.user.id,
      analystId: req.body.analId,
    });
    // res.json(analystList);
    res.json({ message: "success" });
  } catch (err) {
    console.log(err);
    throw err;
  }
});
router.post("/un-follows", async function (req, res, next) {
  // console.log(req);
  const analystList = await models.Follow.destroy({
    where: { userId: req.user.id, analystId: req.body.analId },
  });
  // res.json(analystList);
  res.json({ message: "success" });
});
module.exports = router;
