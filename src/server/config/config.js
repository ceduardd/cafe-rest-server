// port
process.env.PORT = process.env.PORT || 3000;

// env
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// database
let urlDB;

if (process.env.NODE_ENV === 'dev') {
  urlDB = 'mongodb://localhost/cafe';
} else {
  urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;

// token expiration
process.env.TOKEN_EXP = 60 * 60 * 24 * 30;

// seed
process.env.SEED = process.env.SEED || 'dev-seed';
