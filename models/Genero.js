const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    nombre: { type: String, required: true, unique: true, trim: true },
    estado: { type: String, required: true, enum: ["Activo", "Inactivo"], trim: true },
    descripcion: { type: String, trim: true }
  },
  {
    collection: "generos",
    timestamps: {
      createdAt: "fechaCreacion",
      updatedAt: "fechaActualizacion"
    }
  }
);

module.exports = mongoose.model("Genero", schema);
