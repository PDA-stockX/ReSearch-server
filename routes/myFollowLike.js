var express = require("express");
var router = express.Router();

const { initModels } = require("../models/initModels");
const models = initModels();

router.get("/myAnal", async function (req, res, next) {
  try {
    console.log(req.body);
    const myAnalList = await models.Follow.findAll({
      where: { userId: req.body.userId },
    });
    res.json(myAnalList);
  } catch (err) {
    throw err;
  }
});

router.get("/myReport",async function (req,res,next){
    try{
        console.log(req.body);
        const myReportList = await models.LikeReport.findAll({
            where:{userId:req.body.userId}
        })
    }
});

module.exports = router;
