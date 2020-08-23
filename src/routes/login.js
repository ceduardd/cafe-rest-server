const express = require('express');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID); // google client id

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

// verify google token
async function verify(token) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.CLIENT_ID,
  });

  const payload = ticket.getPayload();

  return {
    nombre: payload.name,
    email: payload.email,
    img: payload.picture,
    google: true,
  };
}

router.post('/google', async (req, res) => {
  const token = req.body.idtoken;

  const googleUser = await verify(token).catch((err) => {
    return res.status(403).json({
      ok: false,
      err,
    });
  });

  Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    if (usuarioDB) {
      if (!usuarioDB.google) {
        return res.status(400).json({
          ok: false,
          err: {
            message: 'Debe autenticarse con sus credenciales normales',
          },
        });
      } else {
        const token = jwt.sign({ usuario: usuarioDB }, process.env.SEED, {
          expiresIn: process.env.TOKEN_EXP,
        });

        res.json({
          ok: true,
          usuario: usuarioDB,
          token,
        });
      }
    } else {
      const usuario = new Usuario();

      usuario.nombre = googleUser.nombre;
      usuario.email = googleUser.email;
      usuario.img = googleUser.img;
      usuario.google = googleUser.google;
      usuario.password = ':)';

      usuario.save((err, usuarioDB) => {
        if (err) {
          return res.status(500).json({
            ok: false,
            err,
          });
        }

        const token = jwt.sign({ usuario: usuarioDB }, process.env.SEED, {
          expiresIn: process.env.TOKEN_EXP,
        });

        res.json({
          ok: true,
          usuario: usuarioDB,
          token,
        });
      });
    }
  });
});

module.exports = router;
