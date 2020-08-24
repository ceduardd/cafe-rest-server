require('./config/config');

const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');

const path = require('path');

// initializations
const app = express();

// middlewares
app.use(morgan('dev'));

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));

// parse application/json
app.use(express.json());

// static
app.use(express.static(path.resolve(__dirname, '../public')));

// routes
app.use(require('../routes'));

mongoose
  .connect(process.env.URLDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then((db) =>
    console.log(`BD conectada en ${db.connection.host}:${db.connection.port}`)
  )
  .catch((err) => console.error(err));

app.listen(process.env.PORT, () => {
  console.log(`Escuchando en el puerto ${process.env.PORT}`);
});
