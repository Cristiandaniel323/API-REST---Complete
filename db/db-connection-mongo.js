const mongoose = require("mongoose");

function conectarMongo(uri) {
  return mongoose.connect(uri);
}

module.exports = conectarMongo;
