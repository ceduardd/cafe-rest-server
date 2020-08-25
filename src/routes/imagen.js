const { Router } = require('express');
const router = Router();

const path = require('path');
const fs = require('fs');

const { verifyTokenImg } = require('../middlewares/auth');

router.get('/imagen/:tipo/:img', verifyTokenImg, (req, res) => {
  const { tipo, img } = req.params;

  const pathImg = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);

  if (fs.existsSync(pathImg)) {
    res.sendFile(pathImg);
  } else {
    const pathNoImg = path.resolve(__dirname, '../server/assets/no-image.jpg');
    res.sendFile(pathNoImg);
  }
});

module.exports = router;
