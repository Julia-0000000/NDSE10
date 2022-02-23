const express = require('express');
const router = express.Router();

const User = require('../../models/User');

router.post('/login', async (req, res) => {
  const { mail } = req.body;
  const user = await User.find({ mail });

  if (mail) {
    if (user) {
      res.status(201);
      res.json(user);
    } else {
      res.status(404);
      res.json({ message: 'User is not found' });
    }
  } else {
    res.status(400);
    res.json({ message: 'User mail is not found' });
  }
});

module.exports = router;