const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    nombre: { type: String, required: true, unique: true, trim: true },
    estado: { type: String, required: true, enum: ["Activo", "Inactivo"], trim: true },
    slogan: { type: String, trim: true },
    descripcion: { type: String, trim: true }
  },
  {
    collection: "productora",
    timestamps: {
      createdAt: "fechaCreacion",
      updatedAt: "fechaActualizacion"
    }
  }
);

module.exports = mongoose.model("Productora", schema);
