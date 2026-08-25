const mongoose = require("mongoose");

const mediaSchema = new mongoose.Schema(
  {
    serial: {
      type: String,
      required: [true, "El serial es obligatorio"],
      unique: true,
      trim: true
    },
    titulo: {
      type: String,
      required: [true, "El título es obligatorio"],
      trim: true
    },
    sinopsis: {
      type: String,
      required: [true, "La sinopsis es obligatoria"],
      trim: true
    },
    url: { type: String, required: [true, "La URL es obligatoria"], unique: true, trim: true },
    imagen: { type: String, required: [true, "La imagen es obligatoria"], trim: true },
    anio: { type: Number, required: [true, "El año es obligatorio"], min: 1888, max: 2100 },
    genero: { type: mongoose.Schema.Types.ObjectId, ref: "Genero", required: [true, "El género es obligatorio"] },
    director: { type: mongoose.Schema.Types.ObjectId, ref: "Director", required: [true, "El director es obligatorio"] },
    productora: { type: mongoose.Schema.Types.ObjectId, ref: "Productora", required: [true, "La productora es obligatoria"] },
    tipo: { type: mongoose.Schema.Types.ObjectId, ref: "Tipo", required: [true, "El tipo es obligatorio"] }
  },
  {
    collection: "medias",
    timestamps: {
      createdAt: "fechaCreacion",
      updatedAt: "fechaActualizacion"
    }
  }
);

module.exports = mongoose.model("Media", mediaSchema);
