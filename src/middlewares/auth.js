const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.get('token');

  jwt.verify(token, process.env.SEED, (err, decoded) => {
    if (err) {
      res.status(401).json({
        ok: false,
        err,
      });
    }

    req.usuario = decoded.usuario;
    console.log(decoded);

    next();
  });
};

const validateRole = (req, res, next) => {
  const { role } = req.usuario;

  if (role === 'ADMIN_ROLE') {
    next();
  } else {
    res.json({
      ok: false,
      err: {
        message: 'El usuario no es administrador',
      },
    });
  }
};

module.exports = {
  verifyToken,
  validateRole,
};
