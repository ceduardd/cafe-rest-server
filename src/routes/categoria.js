const { Router } = require('express');
const router = Router();

const Categoria = require('../models/categoria');
const { verifyToken, validateRole } = require('../middlewares/auth');

router.get('/categoria', verifyToken, (req, res) => {
  Categoria.find({})
    .sort('nombre')
    .populate('usuario', 'nombre email')
    .exec((err, categorias) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }

      res.json({
        ok: true,
        categorias,
      });
    });
});

router.get('/categoria/:id', verifyToken, (req, res) => {
  const { id } = req.params;

  Categoria.findById(id, (err, categoriaDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    if (!categoriaDB) {
      return res.status(400).json({
        ok: false,
        err: {
          message: 'Categoría no encontrada',
        },
      });
    }

    res.json({
      ok: true,
      categoria: categoriaDB,
    });
  });
});

router.post('/categoria', verifyToken, (req, res) => {
  const id = req.usuario._id;

  const { nombre, descripcion } = req.body;

  const categoria = new Categoria();

  categoria.nombre = nombre;
  categoria.descripcion = descripcion;
  categoria.usuario = id;

  categoria.save((err, categoriaDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    if (!categoriaDB) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }

    res.json({
      ok: true,
      categoria: categoriaDB,
    });
  });
});

router.put('/categoria/:id', verifyToken, (req, res) => {
  const { nombre, descripcion } = req.body;

  const id = req.params.id;

  Categoria.findByIdAndUpdate(
    id,
    { nombre, descripcion },
    { new: true, runValidators: true },
    (err, categoriaDB) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }

      if (!categoriaDB) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }

      res.json({
        ok: true,
        categoria: categoriaDB,
      });
    }
  );
});

router.delete('/categoria/:id', [verifyToken, validateRole], (req, res) => {
  const id = req.params.id;

  Categoria.findByIdAndRemove(id, (err, categoriaBorrada) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    if (!categoriaBorrada) {
      return res.status(400).json({
        ok: false,
        err: {
          message: 'Categoría no existe',
        },
      });
    }

    res.json({
      ok: true,
      categoria: categoriaBorrada,
    });
  });
});

module.exports = router;
