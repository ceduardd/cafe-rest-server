const { Schema, model } = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const rolesValidos = {
  values: ['USER_ROLE', 'ADMIN_ROLE'],
  message: '{PATH} no es un rol válido',
};

const usuarioSchema = new Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es necesario'],
  },
  email: {
    type: String,
    required: [true, 'El email es necesario'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'La contraseña es obligatoria'],
  },
  img: {
    type: String,
    require: false,
  },
  role: {
    type: String,
    default: 'USER_ROLE',
    enum: rolesValidos,
  },
  estado: {
    type: Boolean,
    default: true,
  },
  google: {
    type: Boolean,
    default: false,
  },
});

usuarioSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  return userObject;
};

usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe ser único' });

module.exports = model('Usuario', usuarioSchema);
