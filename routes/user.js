const express = require('express');
const router = express.Router();

const { User } = require('../models');

const store = {
  user: null,
  users: [
    { id: 1, mail: 'test@mail.ru' },
  ],
};

router.post('/login', (req, res) => {
  const { users } = store;
  const { mail } = req.body;
  const user = users.find(b => b.mail === mail);

  if (mail) {
    if (user) {
      store.user = user;
      res.status(201);
      res.json(user);
    } else {
      res.status(404);
      res.json('User is not found');
    }
  } else {
    res.status(400);
    res.json('User mail is not found');
  }
});

module.exports = router;