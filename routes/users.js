const express = require('express');
const router = express.Router();
const User = require('../models/User');

/* GET users listing. */
router.get('/', async (req, res) => {
  const user = await User.create({
    name: 'John',
    nickname: 'Doe',
    password: 'test1234',
    email: 'test1234@test.com',
  });
  res.json(user);
});

module.exports = router;
