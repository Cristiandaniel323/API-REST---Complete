const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    nombre: { type: String, required: true, unique: true, trim: true },
    estado: { type: String, required: true, enum: ["Activo", "Inactivo"], trim: true }
  },
  {
    collection: "directores",
    timestamps: {
      createdAt: "fechaCreacion",
      updatedAt: "fechaActualizacion"
    }
  }
);

module.exports = mongoose.model("Director", schema);
