const express = require('express');
const router = express.Router();

router.use(require('./usuario'));
router.use(require('./login'));

router.get('/', (req, res) => {
  res.send({
    ok: true,
  });
});

module.exports = router;
