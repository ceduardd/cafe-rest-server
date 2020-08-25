const { Router } = require('express');
const fileUpload = require('express-fileupload');
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

const path = require('path');
const fs = require('fs');

const router = Router();

router.use(fileUpload({ useTempFiles: true }));

router.put('/upload/:tipo/:id', (req, res) => {
  if (!req.files) {
    return res.status(400).json({
      ok: false,
      err,
    });
  }

  let id = req.params.id;
  let tipo = req.params.tipo;

  // tipos válidos
  let tiposValidos = ['usuario', 'producto'];

  if (tiposValidos.indexOf(tipo) < 0) {
    return res.status(400).json({
      ok: false,
      err: {
        message: 'Tipo nó válido',
        tiposPermitidos: tiposValidos.join(', '),
        tipoEnviado: tipo,
      },
    });
  }

  let archivo = req.files.archivo;

  let nombre = archivo.name;
  let split = nombre.split('.');

  let extension = split[split.length - 1];

  // extensiones válidas
  let extensionesValidas = ['jpg', 'png', 'jpeg', 'gif'];

  if (extensionesValidas.indexOf(extension) < 0) {
    return res.status(400).json({
      ok: false,
      err: {
        message: 'La extensión no es válida',
        extensionesPermitidas: extensionesValidas.join(', '),
        extensionEnviada: extension,
      },
    });
  }

  // cambiar nombre archivo

  let archivoRenombrado = `${id}-${new Date().getMilliseconds()}.${extension}`;

  archivo.mv(`uploads/${tipo}/${archivoRenombrado}`, (err) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err: {
          message: 'Error al mover el archivo',
        },
      });
    }

    if (tipo === 'usuario') {
      imagenUsuario(id, archivoRenombrado, res);
    } else {
      imagenProducto(id, archivoRenombrado, res);
    }
  });
});

function imagenUsuario(id, nombreArchivo, res) {
  Usuario.findById(id, (err, usuarioDB) => {
    borrarArchivo(usuarioDB.img, 'usuario');
    if (err) {
      return res.status(500).json({
        ok: true,
        err,
      });
    }

    if (!usuarioDB) {
      borrarArchivo(usuarioDB.img, 'usuario');
      return res.status(400).json({
        ok: false,
        err: {
          message: 'ID inválido usuario',
        },
      });
    }

    borrarArchivo(usuarioDB.img, 'usuario');

    usuarioDB.img = nombreArchivo;

    usuarioDB.save((err, usuarioGuardado) => {
      if (err) {
        return res.status(500).json({
          ok: true,
          err,
        });
      }

      res.json({
        ok: true,
        usuario: usuarioGuardado,
        message: 'Archivo cargado correctamente',
      });
    });
  });
}

function borrarArchivo(nombreArchivo, tipo) {
  let pathImagen = path.resolve(
    __dirname,
    `../../uploads/${tipo}/${nombreArchivo}`
  );

  if (fs.existsSync(pathImagen)) {
    fs.unlinkSync(pathImagen);
  }
}

function imagenProducto(id, nombreArchivo, res) {
  Producto.findById(id, (err, productoDB) => {
    if (err) {
      borrarArchivo(productoDB.img, 'producto');
      return res.status(500).json({
        ok: true,
        err,
      });
    }

    if (!productoDB) {
      borrarArchivo(productoDB.img, 'producto');
      return res.status(400).json({
        ok: false,
        err: {
          message: 'ID inválido producto',
        },
      });
    }

    borrarArchivo(productoDB.img, 'producto');

    productoDB.img = nombreArchivo;

    productoDB.save((err, productoGuardado) => {
      if (err) {
        return res.status(500).json({
          ok: true,
          err,
        });
      }

      res.json({
        ok: true,
        usuario: productoGuardado,
        message: 'Archivo cargado correctamente',
      });
    });
  });
}

module.exports = router;
