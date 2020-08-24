const { Router } = require('express');
const router = Router();

const { verifyToken } = require('../middlewares/auth');

// Product Scheme
const Producto = require('../models/producto');
const producto = require('../models/producto');

router.get('/producto', (req, res) => {
  Producto.find({ disponible: true })
    .populate('categoria', 'nombre')
    .populate('usuario', 'nombre email')
    .exec((err, productos) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }

      res.json({
        ok: true,
        productos,
      });
    });
});

router.get('/producto/:id', verifyToken, (req, res) => {
  const id = req.params.id;

  Producto.findById(id)
    .populate('categoria', 'nombre')
    .populate('usuario', 'nombre email')
    .exec((err, productoDB) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }

      if (!productoDB) {
        return res.status(400).json({
          ok: false,
          err: {
            message: 'El producto no ha sido encontrado',
          },
        });
      }

      res.json({
        ok: true,
        producto: productoDB,
      });
    });
});

router.get('/producto/buscar/:termino', (req, res) => {
  const termino = req.params.termino;

  const regex = new RegExp(termino, 'i');

  Producto.find({ nombre: regex })
    .populate('categoria', 'nombre')
    .populate('usuario', 'nombre email')
    .exec((err, productos) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }

      res.json({
        ok: true,
        productos,
      });
    });
});

router.post('/producto', verifyToken, (req, res) => {
  const usuario = req.usuario._id;
  const body = req.body;

  const newProduct = new Producto();

  newProduct.nombre = body.nombre;
  newProduct.precioUni = body.precioUni;
  newProduct.descripcion = body.descripcion;
  newProduct.categoria = body.categoria;
  newProduct.usuario = usuario;

  newProduct.save((err, productoDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    res.status(201).json({
      ok: true,
      producto: productoDB,
    });
  });
});

router.put('/producto/:id', verifyToken, (req, res) => {
  const id = req.params.id;
  const body = req.body;

  Producto.findByIdAndUpdate(
    id,
    body,
    { new: true, runValidators: true },
    (err, productoDB) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }

      if (!productoDB) {
        return res.status(400).json({
          ok: false,
          err: {
            message: 'Producto no encontrado',
          },
        });
      }

      res.json({
        ok: true,
        producto: productoDB,
      });
    }
  );
});

router.delete('/producto/:id', verifyToken, (req, res) => {
  const id = req.params.id;

  Producto.findByIdAndUpdate(
    id,
    { disponible: false },
    { new: true },
    (err, productoBorrado) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }

      if (!productoBorrado) {
        return res.status(400).json({
          ok: false,
          err: {
            message: 'Producto no encontrado',
          },
        });
      }

      res.json({
        ok: true,
        producto: productoBorrado,
        message: 'Producto borrado',
      });
    }
  );
});

module.exports = router;
