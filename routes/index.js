const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json('Index');
});

module.exports = router;