const express = require('express');
const _ = require('underscore');
const Usuario = require('../models/usuario');
const { encryptPassword } = require('../lib/helpers');
const { verifyToken, validateRole } = require('../middlewares/auth');

const router = express.Router();

router.get('/usuario', verifyToken, (req, res) => {
  // req.usuario

  let { since, limit } = req.query;
  since = Number(since);
  limit = Number(limit);
  Usuario.find({ estado: true }, 'nombre email estado img role google') // filtering for presentation
    .skip(since)
    .limit(limit)
    .exec((err, usuarios) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }

      Usuario.count({ estado: true }, (err, count) => {
        res.json({
          ok: true,
          usuarios,
          count,
        });
      });
    });
});

router.post('/usuario', [verifyToken, validateRole], async (req, res) => {
  const body = req.body;

  // save password encrypted
  const password = body.password;
  const passwordEncrypt = await encryptPassword(password);

  const usuario = new Usuario({
    nombre: body.nombre,
    email: body.email,
    password: passwordEncrypt,
    role: body.role,
  });

  usuario.save((err, usuarioDB) => {
    if (err) {
      return res.json({
        ok: false,
        err,
      });
    }

    res.json({
      ok: true,
      usuario: usuarioDB,
    });
  });
});

router.put('/usuario/:id', [verifyToken, validateRole], (req, res) => {
  const { id } = req.params;

  // sending keys available to update
  const body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

  Usuario.findByIdAndUpdate(
    id,
    body,
    { new: true, runValidators: true },
    (err, usuarioDB) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }

      res.json({
        ok: true,
        usuario: usuarioDB,
      });
    }
  );
});

router.delete('/usuario/:id', [verifyToken, validateRole], (req, res) => {
  const { id } = req.params;
  Usuario.findByIdAndUpdate(
    id,
    { estado: false },
    { new: true },
    (err, usuarioBorrado) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }

      /* if (!usuarioBorrado) {
        return res.status(400).json({
          ok: false,
          err: {
            message: 'Usuario no encontrado',
          },
        });
      } */

      res.send({
        ok: true,
        usuario: usuarioBorrado,
      });
    }
  );
});

module.exports = router;
