const { Schema, model, SchemaTypes } = require('mongoose');

const categoriaSchema = new Schema({
  nombre: {
    type: String,
    unique: true,
    required: true,
  },
  descripcion: {
    type: String,
    required: true,
  },
  usuario: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true,
  },
});

module.exports = model('Categoria', categoriaSchema);
