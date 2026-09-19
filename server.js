require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const conectarMongo = require("./db/db-connection-mongo");

const mediaRoutes = require("./routes/media.routes");
const directorRoutes = require("./routes/director.routes");
const generoRoutes = require("./routes/genero.routes");
const tipoRoutes = require("./routes/tipo.routes");
const productoraRoutes = require("./routes/productora.routes");

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/peliculas";

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    mensaje: "API REST de Películas funcionando correctamente",
    version: "1.0.0",
    endpoints: {
      media: "/api/media",
      director: "/api/director",
      genero: "/api/genero",
      tipo: "/api/tipo",
      productora: "/api/productora",
      health: "/api/health"
    }
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    mongodb:
      mongoose.connection.readyState === 1 ? "conectado" : "desconectado"
  });
});

// Rutas singulares requeridas por la evidencia y alias plurales de compatibilidad.
app.use("/api/media", mediaRoutes);
app.use("/api/director", directorRoutes);
app.use("/api/genero", generoRoutes);
app.use("/api/tipo", tipoRoutes);
app.use("/api/productora", productoraRoutes);
app.use("/api/medias", mediaRoutes);
app.use("/api/directores", directorRoutes);
app.use("/api/generos", generoRoutes);
app.use("/api/tipos", tipoRoutes);
app.use("/api/productoras", productoraRoutes);

app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

app.use((err, req, res, next) => {
  console.error(err);

  if (err.name === "ValidationError") {
    return res.status(400).json({
      error: "Error de validación",
      detalles: Object.values(err.errors).map((e) => e.message)
    });
  }

  if (err.name === "CastError") {
    return res.status(400).json({
      error: "Dato con formato inválido"
    });
  }

  if (err && err.code === 11000) {
    const campo = Object.keys(err.keyPattern || {})[0] || "dato";
    return res.status(400).json({
      error: "Error de validación",
      detalles: [`El valor del campo ${campo} ya existe`]
    });
  }

  res.status(500).json({
    error: "Error interno del servidor"
  });
});

conectarMongo(MONGODB_URI)
  .then(() => {
    console.log("MongoDB conectado:");
    app.listen(PORT, () => {
      console.log(`API ejecutándose en http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("No se pudo conectar a MongoDB:", error.message);
    process.exit(1);
  });
