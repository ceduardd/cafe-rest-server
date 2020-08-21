const express = require('express');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');
const router = express.Router();

const { matchPassword } = require('../lib/helpers');

router.post('/login', (req, res) => {
  const body = req.body;

  Usuario.findOne({ email: body.email }, async (err, usuarioDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    if (!usuarioDB) {
      return res.status(400).json({
        ok: false,
        err: {
          message: '(Usuario) o contraseña no válidos',
        },
      });
    }

    const match = await matchPassword(body.password, usuarioDB.password);

    if (!match) {
      return res.status(400).json({
        ok: false,
        err: {
          message: 'Usuario o (contraseña) no válidos',
        },
      });
    }

    let token = jwt.sign({ usuario: usuarioDB }, process.env.SEED, {
      expiresIn: process.env.TOKEN_EXP,
    });

    res.json({
      ok: true,
      usuario: usuarioDB,
      token,
    });
  });
});

module.exports = router;
