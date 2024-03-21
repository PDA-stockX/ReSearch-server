const express = require("express");
const router = express.Router();
const { createToken, verifyToken } = require("../services/auth");

const { initModels } = require("../models/initModels");
const models = initModels();

router.post("/sign-up", async (req, res, next) => {
    try {
        const {email, password, name, nickname} = req.body;
        const user = await models.User.signUp(email, password, name, nickname);
        res.status(201).json({message: "success"});
    } catch (err) {
        console.log(err.errors[0].message);
        res.status(400).json({message: err.errors[0].message});
        next(err);
    }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await models.User.signIn(email, password);

    const tokenMaxAge = 60 * 60 * 24 * 3;
    const token = createToken(user, tokenMaxAge);
    user.token = token;

    res.cookie("authToken", token, {
      //  쿠키로 보내는 방식
      httpOnly: true,
      maxAge: tokenMaxAge * 1000,
    });

    res.status(201).json(user);
  } catch (err) {
    console.error(err);
    res.status(400);
    next(err);
  }
});

router.all("/logout", async (req, res, next) => {
  try {
    res.cookie("authToken", "", {
      httpOnly: true,
      expires: new Date(Date.now()),
    });
    res.status(200).json({ message: "success" });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "fail" });
    next(err);
  }
});

router.post("/verifyToken", async (req, res, next) => {
  try {
    const token = req.cookies["authToken"];

        const validToken = verifyToken(token);

        if (validToken) {
            return res.status(200).json({message: "success"});
        } else {
            return res.status(401).json({message: "fail"});
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({message: "서버 오류"});
    }
  });

router.get('/check-nickname', async (req, res, next) => {
    try {
        const user = await models.User.findOne({
            where: {
                nickname: req.query.nickname
            }
        });
        if (user) {
            res.json({message: "fail"});
        } else {
            res.json({message: "success"});
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({message: "서버 오류"});
    }
});

router.get('/:id', (req, res, next) => {

    models.User.findByPk(req.params.id)
        .then(data => {
            res.json(data);
        })
        .catch(err => {
            return next(err);
        })
});

module.exports = router;