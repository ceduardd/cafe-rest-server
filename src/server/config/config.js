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
process.env.TOKEN_EXP = '48h';

// seed
process.env.SEED = process.env.SEED || 'dev-seed';

// google client id
process.env.CLIENT_ID =
  process.env.CLIENT_ID ||
  '1008124149193-sgq0c4hs3ilt1p7k9ia6alf00bvta097.apps.googleusercontent.com';
