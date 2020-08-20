// port
process.env.PORT = process.env.PORT || 3000;

// env
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// database
let urlDB;

if (process.env.NODE_ENV === 'dev') {
  urlDB = 'mongodb://localhost/cafe';
} else {
  urlDB =
    'mongodb+srv://Eduardo:VlL3lrRIIsdlHnZd@clustertest.6dfr6.mongodb.net/cafe';
}

process.env.URLDB = urlDB;
