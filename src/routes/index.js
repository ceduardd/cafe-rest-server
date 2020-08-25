const express = require('express');
const router = express.Router();

router.use(require('./usuario'));
router.use(require('./login'));
router.use(require('./categoria'));
router.use(require('./producto'));
router.use(require('./upload'));
router.use(require('./imagen'));

router.get('/', (req, res) => {
  res.send({
    ok: true,
  });
});

module.exports = router;
